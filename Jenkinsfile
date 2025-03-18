pipeline {
    agent none  // 최상위 에이전트를 지정하지 않아 각 단계에서 개별적으로 노드를 선택
    options {
        disableConcurrentBuilds()  // 동시 빌드를 비활성화하여 빌드 충돌 방지
    }
    parameters {
        string(name: 'TRAFFIC_SPLIT', defaultValue: '10', description: '카나리 배포 시 트래픽 비율 (%)')  // 카나리 배포에서 새 버전으로 보낼 트래픽 비율 설정
    }
    environment {
        DOCKER_IMAGE_PREFIX = "murhyun2"  // 도커 이미지 이름의 접두사 (예: murhyun2/yoohoo-canary-backend)
        EC2_PUBLIC_HOST = "j12b209.p.ssafy.io"  // 공용 EC2 서버 주소 (Nginx가 실행되는 서버)
        COMPOSE_PROJECT_NAME = "yoohoo"  // 도커 컴포즈 프로젝트 이름 (컨테이너 이름 등에 사용)
        EC2_PUBLIC_SSH_CREDENTIALS_ID = "ec2-ssh-key"  // 공용 EC2에 접속할 SSH 키의 Jenkins ID
        EC2_BACKEND_SSH_CREDENTIALS_ID = "ec2-backend-ssh-key"  // 백엔드 EC2에 접속할 SSH 키의 Jenkins ID
        EC2_FRONTEND_SSH_CREDENTIALS_ID = "ec2-frontend-ssh-key"  // 프론트엔드 EC2에 접속할 SSH 키의 Jenkins ID
        GIT_CREDENTIALS_ID = "gitlab-token"  // GitLab에 접속할 인증 토큰의 Jenkins ID
        GIT_REPOSITORY_URL = "https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21B209"  // 소스코드를 가져올 Git 저장소 URL
        PROJECT_DIRECTORY = "yoohoo"  // 프로젝트 파일이 저장될 디렉토리 이름
        EC2_USER = "ubuntu"  // EC2 서버의 사용자 이름 (SSH 접속 시 사용)
        DOCKER_HUB_CREDENTIALS_ID = "dockerhub-token"  // Docker Hub에 로그인할 인증 정보의 Jenkins ID
        STABLE_TAG = "stable-${env.BUILD_NUMBER}"  // 안정 버전 이미지 태그 (예: stable-1, 빌드 번호 포함)
        CANARY_TAG = "canary-${env.BUILD_NUMBER}"  // 카나리 버전 이미지 태그 (예: canary-1, 빌드 번호 포함)
    }
    stages {
        stage('Checkout') {
            agent any  // 코드 체크아웃은 어느 노드에서든 실행 가능
            steps {
                git branch: "develop", credentialsId: "${GIT_CREDENTIALS_ID}", url: "${GIT_REPOSITORY_URL}"  // GitLab에서 develop 브랜치 소스코드를 가져옴
            }
        }

        stage('Prepare Environment') {
            agent any  // 환경 준비는 특정 노드에 의존하지 않음
            steps {
                withCredentials([file(credentialsId: 'env-file-content', variable: 'ENV_FILE_PATH')]) {  // Jenkins에 저장된 환경 파일을 가져옴
                    script {
                        def envContent = readFile(ENV_FILE_PATH).replaceAll('\r', '')  // 환경 파일 내용을 읽음
                        dir("${PROJECT_DIRECTORY}") {
                            writeFile file: '.env', text: envContent  // 프로젝트 디렉토리에 .env 파일 생성
                        }

                        // .env 파일에서 환경 변수 읽기
                        sh '''
                            set -a  # 자동으로 변수를 export
                            . ${PROJECT_DIRECTORY}/.env
                            set +a
                        '''
                    }
                }
            }
        }

        stage('Build & Push Images') {
            parallel {  // 병렬로 작업을 실행하여 시간 절약
                stage('Build Backend') {
                    agent { label 'backend-dev' }  // 백엔드 빌드는 backend-dev 노드에서 실행
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {  // Docker Hub에 로그인
                                dir("${PROJECT_DIRECTORY}/backend") {
                                    sh """
                                        docker build -t ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG} .  // 백엔드 카나리 이미지 빌드
                                        docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG}  // 빌드한 이미지를 Docker Hub에 업로드
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Build Frontend') {
                    agent { label 'frontend-dev' }  // 프론트엔드 빌드는 frontend-dev 노드에서 실행
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {  // Docker Hub에 로그인
                                dir("${PROJECT_DIRECTORY}/frontend") {
                                    sh """
                                        docker build -t ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG} .  // 프론트엔드 카나리 이미지 빌드
                                        docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG}  // 빌드한 이미지를 Docker Hub에 업로드
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Configure Nginx') {
                    agent { label 'public-dev' }  // Nginx 설정은 public-dev 노드에서 실행
                    steps {
                        script {
                            dir("${PROJECT_DIRECTORY}/nginx") {
                                def nginxConfig = """
                                    upstream backend {
                                        server ${env.EC2_BACKEND_HOST}:8080 weight=${100 - params.TRAFFIC_SPLIT.toInteger()};  // 기존 백엔드 서버로 가는 트래픽 비율
                                        server ${env.EC2_BACKEND_HOST}:8081 weight=${params.TRAFFIC_SPLIT.toInteger()};  // 카나리 백엔드 서버로 가는 트래픽 비율
                                    }
                                    upstream frontend {
                                        server ${env.EC2_FRONTEND_HOST}:3000 weight=${100 - params.TRAFFIC_SPLIT.toInteger()};  // 기존 프론트엔드 서버로 가는 트래픽 비율
                                        server ${env.EC2_FRONTEND_HOST}:3001 weight=${params.TRAFFIC_SPLIT.toInteger()};  // 카나리 프론트엔드 서버로 가는 트래픽 비율
                                    }
                                    server {
                                        listen 80;  // 80번 포트에서 요청 수신
                                        location /api {
                                            proxy_pass http://backend;  // /api 요청을 백엔드로 전달
                                            proxy_set_header Host \$host;  // 호스트 헤더 설정
                                            proxy_set_header X-Real-IP \$remote_addr;  // 클라이언트 IP 전달
                                        }
                                        location / {
                                            proxy_pass http://frontend;  // 기본 요청을 프론트엔드로 전달
                                            proxy_set_header Host \$host;  // 호스트 헤더 설정
                                            proxy_set_header X-Real-IP \$remote_addr;  // 클라이언트 IP 전달
                                        }
                                    }
                                """
                                writeFile file: 'nginx.conf', text: nginxConfig  // Nginx 설정 파일 생성
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy Canary') {
            agent { label 'public-dev' }  // 배포 작업은 public-dev 노드에서 실행
            steps {
                script {
                    parallel(  // 백엔드와 프론트엔드 배포를 병렬로 실행
                        "Backend Deployment": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_BACKEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 백엔드 서버 SSH 인증
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${env.EC2_BACKEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose pull canary_backend &&  // 카나리 백엔드 이미지 다운로드
                                        docker compose up -d --no-deps canary_backend  // 카나리 백엔드 컨테이너 실행
                                    "
                                """
                            }
                        },
                        "Frontend Deployment": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 프론트엔드 서버 SSH 인증
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${env.EC2_FRONTEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose pull canary_frontend &&  // 카나리 프론트엔드 이미지 다운로드
                                        docker compose up -d --no-deps canary_frontend  // 카나리 프론트엔드 컨테이너 실행
                                    "
                                """
                            }
                        }
                    )

                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 공용 서버 SSH 인증
                        sh """
                            scp -i ${SSH_KEY} ${PROJECT_DIRECTORY}/nginx/nginx.conf ${EC2_USER}@${EC2_PUBLIC_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/nginx/  // Nginx 설정 파일 업로드
                            ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose up -d nginx &&  // Nginx 컨테이너 실행
                                docker exec ${COMPOSE_PROJECT_NAME}-nginx-1 nginx -s reload  // Nginx 설정 리로드
                            "
                        """
                    }
                }
            }
        }

        stage('Health Check') {
            agent { label 'public-dev' }  // 헬스 체크는 public-dev 노드에서 실행
            steps {
                script {
                    def backendHealth = sh(script: "curl -f http://${env.EC2_BACKEND_HOST}:8081/health", returnStatus: true)  // 백엔드 카나리 버전 헬스 체크
                    def frontendHealth = sh(script: "curl -f http://${env.EC2_FRONTEND_HOST}:3001/health", returnStatus: true)  // 프론트엔드 카나리 버전 헬스 체크
                    if (backendHealth != 0 || frontendHealth != 0) {
                        error("헬스 체크 실패: 카나리 배포가 정상적으로 실행되지 않았습니다.")  // 헬스 체크 실패 시 에러 발생
                    }
                }
            }
        }

        stage('Approval') {
            agent any  // 수동 승인은 특정 노드 필요 없음
            steps {
                input message: '카나리 테스트를 승인하시겠습니까?', ok: '프로덕션 배포'  // 관리자의 수동 승인 대기
            }
        }

        stage('Promote to Stable') {
            agent { label 'public-dev' }  // 안정 버전 승격은 public-dev 노드에서 실행
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {  // Docker Hub에 로그인
                        sh """
                            docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG} ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-backend:${STABLE_TAG}  // 카나리 백엔드 이미지를 안정 버전으로 태깅
                            docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG} ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-frontend:${STABLE_TAG}  // 카나리 프론트엔드 이미지를 안정 버전으로 태깅
                            docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-backend:${STABLE_TAG}  // 안정 백엔드 이미지 업로드
                            docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-frontend:${STABLE_TAG}  // 안정 프론트엔드 이미지 업로드
                        """
                    }

                    parallel(  // 백엔드와 프론트엔드 승격을 병렬로 실행
                        "Backend Promotion": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_BACKEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 백엔드 서버 SSH 인증
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${env.EC2_BACKEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose pull stable_backend &&  // 안정 백엔드 이미지 다운로드
                                        docker compose up -d --no-deps stable_backend &&  // 안정 백엔드 컨테이너 실행
                                        docker compose stop canary_backend &&  // 카나리 백엔드 중지
                                        docker compose rm -f canary_backend  // 카나리 백엔드 컨테이너 삭제
                                    "
                                """
                            }
                        },
                        "Frontend Promotion": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 프론트엔드 서버 SSH 인증
                                sh """
                                    ssh -i ${SSH_KEY} ${EC2_USER}@${env.EC2_FRONTEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose pull stable_frontend &&  // 안정 프론트엔드 이미지 다운로드
                                        docker compose up -d --no-deps stable_frontend &&  // 안정 프론트엔드 컨테이너 실행
                                        docker compose stop canary_frontend &&  // 카나리 프론트엔드 중지
                                        docker compose rm -f canary_frontend  // 카나리 프론트엔드 컨테이너 삭제
                                    "
                                """
                            }
                        }
                    )

                    dir("${PROJECT_DIRECTORY}/nginx") {
                        writeFile file: 'nginx.conf', text: """
                            upstream backend {
                                server ${env.EC2_BACKEND_HOST}:8080;  // 안정 백엔드 서버로 100% 트래픽 전환
                            }
                            upstream frontend {
                                server ${env.EC2_FRONTEND_HOST}:3000;  // 안정 프론트엔드 서버로 100% 트래픽 전환
                            }
                            server {
                                listen 80;  // 80번 포트에서 요청 수신
                                location /api {
                                    proxy_pass http://backend;  // /api 요청을 백엔드로 전달
                                    proxy_set_header Host \$host;  // 호스트 헤더 설정
                                    proxy_set_header X-Real-IP \$remote_addr;  // 클라이언트 IP 전달
                                }
                                location / {
                                    proxy_pass http://frontend;  // 기본 요청을 프론트엔드로 전달
                                    proxy_set_header Host \$host;  // 호스트 헤더 설정
                                    proxy_set_header X-Real-IP \$remote_addr;  // 클라이언트 IP 전달
                                }
                            }
                        """  // 안정 버전으로 전환된 Nginx 설정 파일 생성
                    }

                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 공용 서버 SSH 인증
                        sh """
                            scp -i ${SSH_KEY} ${PROJECT_DIRECTORY}/nginx/nginx.conf ${EC2_USER}@${EC2_PUBLIC_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/nginx/  // Nginx 설정 파일 업로드
                            ssh -i ${SSH_KEY} ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose up -d nginx &&  // Nginx 컨테이너 실행
                                docker exec ${COMPOSE_PROJECT_NAME}-nginx-1 nginx -s reload  // Nginx 설정 리로드
                            "
                        """
                    }
                }
            }
        }
    }
    post {
        failure {
            node('public-dev') {
                echo "배포 실패: 롤백을 진행합니다."  // 파이프라인 실패 시 메시지 출력
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_BACKEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 백엔드 서버 SSH 인증
                        sh """
                            ssh -i ${SSH_KEY} ${EC2_USER}@${env.EC2_BACKEND_HOST} "
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose pull stable_backend &&  // 안정 백엔드 이미지 다운로드
                                docker compose up -d --no-deps stable_backend  // 안정 백엔드 컨테이너 실행
                            "
                        """
                    }
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 프론트엔드 서버 SSH 인증
                        sh """
                            ssh -i ${SSH_KEY} ${EC2_USER}@${env.EC2_FRONTEND_HOST} "
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose pull stable_frontend &&  // 안정 프론트엔드 이미지 다운로드
                                docker compose up -d --no-deps stable_frontend  // 안정 프론트엔드 컨테이너 실행
                            "
                        """
                    }
                }
            }
        }
        always {
            node('public-dev') {
                script {
                    def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                    def Author_Email = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                    def Commit_Message = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                    def Branch_Name = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    def Build_Time = new Date(currentBuild.startTimeInMillis).format("yyyy년 MM월 dd일 HH시 mm분 ss초", TimeZone.getTimeZone("Asia/Seoul"))
                    def Duration = currentBuild.durationString.replace(' and counting', '')
                    def Status = currentBuild.result ?: "SUCCESS"
                    def Color = (Status == "SUCCESS") ? 'good' : 'danger'
                    def Icon = (Status == "SUCCESS") ? "✅" : "❌"

                    def Message = """\
                    ${Icon} *BUILD ${Status}*
                    - *Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
                    - *Branch:* ${Branch_Name}
                    - *Author:* ${Author_ID} (${Author_Email})
                    - *Commit:* ${Commit_Message}
                    - *시작 시간:* ${Build_Time}
                    - *소요 시간:* ${Duration}
                    [🔍 *Details*](${env.BUILD_URL})
                    """.stripIndent()

                    mattermostSend(
                        color: Color,
                        message: Message,
                        endpoint: 'https://meeting.ssafy.com/hooks/3wgn4b8xz7nnpcfb7rkdrwr1mo',
                        channel: 'B209-Jenkins-Result'
                    )
                }
            }
        }
    }
}