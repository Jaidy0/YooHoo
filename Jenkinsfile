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
        GIT_BRANCH = "infra-dev"
        EC2_PUBLIC_HOST = "j12b209.p.ssafy.io"  // 공용 EC2 서버 주소 (Nginx가 실행되는 서버)
        EC2_BACKEND_HOST = ""
        EC2_FRONTEND_HOST = ""
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
        BACKEND_IMAGE = "${DOCKER_IMAGE_PREFIX}/yoohoo-backend"  // 통합 이미지명 변수
        FRONTEND_IMAGE = "${DOCKER_IMAGE_PREFIX}/yoohoo-frontend"
    }
    stages {
        stage('Checkout') {
            agent any  // 코드 체크아웃은 어느 노드에서든 실행 가능
            steps {
                   git branch: "infra-dev", credentialsId: "${GIT_CREDENTIALS_ID}", url: "${GIT_REPOSITORY_URL}"  // GitLab에서 infra-dev 브랜치 소스코드를 가져옴
                }
            }
        }

        stage('Prepare Environment') {
            agent any  // 환경 준비는 특정 노드에 의존하지 않음
            steps {
                withCredentials([file(credentialsId: 'env-file-content', variable: 'ENV_FILE_PATH')]) {  // Jenkins에 저장된 환경 파일을 가져옴
                    script {
                        def envContent = readFile(ENV_FILE_PATH).replaceAll('\r', '')  // 환경 파일 내용을 읽음

                        // 기본 환경 변수 추가
                        def extraEnv = """
                        DOCKER_IMAGE_PREFIX=${DOCKER_IMAGE_PREFIX}
                        STABLE_TAG=stable-${BUILD_NUMBER}
                        CANARY_TAG=canary-${BUILD_NUMBER}
                        BACKEND_IMAGE=${DOCKER_IMAGE_PREFIX}/yoohoo-backend
                        FRONTEND_IMAGE=${DOCKER_IMAGE_PREFIX}/yoohoo-frontend
                        """

                        // 기존 .env 내용 + 추가 변수 저장
                        def finalEnvContent = envContent + "\n" + extraEnv.trim()

                        dir("${PROJECT_DIRECTORY}") {
                            writeFile file: '.env', text: finalEnvContent // 프로젝트 디렉토리에 .env 파일 생성
                        }

                        // .env 파일 내용을 Map으로 변환
                        def envMap = [:]
                        finalEnvContent.split('\n').each { line ->
                            def keyValue = line.split('=', 2)
                            if (keyValue.size() == 2) {
                                envMap[keyValue[0].trim()] = keyValue[1].trim()
                            }
                        }

                        EC2_BACKEND_HOST = envMap['EC2_BACKEND_HOST']
                        EC2_FRONTEND_HOST = envMap['EC2_FRONTEND_HOST']
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
                                dir("backend") {
                                    sh """
                                        docker build -t ${BACKEND_IMAGE}:${CANARY_TAG} .  # 백엔드 카나리 이미지 빌드
                                        docker push ${BACKEND_IMAGE}:${CANARY_TAG}  # 빌드한 이미지를 Docker Hub에 업로드
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
                                dir("frontend") {
                                    sh """
                                        docker build -t ${FRONTEND_IMAGE}:${CANARY_TAG} .  # 프론트엔드 카나리 이미지 빌드
                                        docker push ${FRONTEND_IMAGE}:${CANARY_TAG}  # 빌드한 이미지를 Docker Hub에 업로드
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
                            dir("nginx") {
                                def nginxConfig = """
                                    upstream backend {
                                        server ${EC2_BACKEND_HOST}:8080 weight=${100 - params.TRAFFIC_SPLIT.toInteger()};  // 기존 백엔드 서버로 가는 트래픽 비율
                                        server ${EC2_BACKEND_HOST}:8081 weight=${params.TRAFFIC_SPLIT.toInteger()};  // 카나리 백엔드 서버로 가는 트래픽 비율
                                    }
                                    upstream frontend {
                                        server ${EC2_FRONTEND_HOST}:3000 weight=${100 - params.TRAFFIC_SPLIT.toInteger()};  // 기존 프론트엔드 서버로 가는 트래픽 비율
                                        server ${EC2_FRONTEND_HOST}:3001 weight=${params.TRAFFIC_SPLIT.toInteger()};  // 카나리 프론트엔드 서버로 가는 트래픽 비율
                                    }
                                    server {
                                        listen 80;

                                        # Next.js 서버로 프록시
                                        location / {
                                            proxy_pass http://frontend;
                                            proxy_http_version 1.1;
                                            proxy_set_header Upgrade \$http_upgrade;
                                            proxy_set_header Connection 'upgrade';
                                            proxy_set_header Host \$host;
                                            proxy_cache_bypass \$http_upgrade;
                                            proxy_set_header X-Real-IP \$remote_addr;
                                            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                                            proxy_set_header X-Forwarded-Proto \$scheme;
                                        }

                                        # 정적 파일 제공 (Next.js 빌드된 파일)
                                        location /_next/ {
                                            proxy_pass http://frontend;
                                            proxy_cache_valid 200 1h;
                                            proxy_set_header Cache-Control "public, max-age=31536000, immutable";
                                        }

                                        # API 요청을 백엔드로 전달
                                        location /api/ {
                                            proxy_pass http://backend;
                                            proxy_http_version 1.1;
                                            proxy_set_header Upgrade \$http_upgrade;
                                            proxy_set_header Connection 'upgrade';
                                            proxy_set_header Host \$host;
                                            proxy_cache_bypass \$http_upgrade;
                                            proxy_set_header X-Real-IP \$remote_addr;
                                            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                                            proxy_set_header X-Forwarded-Proto \$scheme;
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
                                    ssh -i \$SSH_KEY ${EC2_USER}@${EC2_BACKEND_HOST} "mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}"
                                    scp -i \$SSH_KEY ${PROJECT_DIRECTORY}/docker-compose.backend.yml ${EC2_USER}@${EC2_BACKEND_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/
                                    scp -i \$SSH_KEY ${PROJECT_DIRECTORY}/.env ${EC2_USER}@${EC2_BACKEND_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_BACKEND_HOST} "
                                        mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&  # 디렉토리가 없으면 생성
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose -f docker-compose.backend.yml pull canary_backend &&  # 카나리 백엔드 이미지 다운로드
                                        docker compose -f docker-compose.backend.yml up -d canary_backend  # 카나리 백엔드 컨테이너 실행
                                    "
                                """
                            }
                        },
                        "Frontend Deployment": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 프론트엔드 서버 SSH 인증
                                sh """
                                    ssh -i \$SSH_KEY ${EC2_USER}@${EC2_FRONTEND_HOST} "mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}"
                                    scp -i \$SSH_KEY ${PROJECT_DIRECTORY}/docker-compose.frontend.yml ${EC2_USER}@${EC2_FRONTEND_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/
                                    scp -i \$SSH_KEY ${PROJECT_DIRECTORY}/.env ${EC2_USER}@${EC2_FRONTEND_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_FRONTEND_HOST} "
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose -f docker-compose.frontend.yml pull canary_frontend &&  # 카나리 프론트엔드 이미지 다운로드
                                        docker compose -f docker-compose.frontend.yml up -d canary_frontend  # 카나리 프론트엔드 컨테이너 실행
                                    "
                                """
                            }
                        }
                    )

                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 공용 서버 SSH 인증
                        sh """
                            scp -i \$SSH_KEY ${PROJECT_DIRECTORY}/nginx/nginx.conf ${EC2_USER}@${EC2_PUBLIC_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/nginx/  # Nginx 설정 파일 업로드
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&  # 디렉토리가 없으면 생성
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose -f docker-compose.infra.yml up -d &&  # Nginx 컨테이너 실행
                                docker exec nginx_lb nginx -s reload  # Nginx 설정 리로드
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
                    def backendHealth = sh(script: "curl -f http://${EC2_BACKEND_HOST}:8081/health", returnStatus: true)  // 백엔드 카나리 버전 헬스 체크
                    def frontendHealth = sh(script: "curl -f http://${EC2_FRONTEND_HOST}:3001/health", returnStatus: true)  // 프론트엔드 카나리 버전 헬스 체크
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
                            docker tag ${BACKEND_IMAGE}:${CANARY_TAG} ${BACKEND_IMAGE}:${STABLE_TAG}  # 카나리 백엔드 이미지를 안정 버전으로 태깅
                            docker tag ${FRONTEND_IMAGE}:${CANARY_TAG} ${FRONTEND_IMAGE}:${STABLE_TAG}  # 카나리 프론트엔드 이미지를 안정 버전으로 태깅
                            docker push ${BACKEND_IMAGE}:${STABLE_TAG}  # 안정 백엔드 이미지 업로드
                            docker push ${FRONTEND_IMAGE}:${STABLE_TAG}  # 안정 프론트엔드 이미지 업로드
                        """
                    }

                    parallel(  // 백엔드와 프론트엔드 승격을 병렬로 실행
                        "Backend Promotion": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_BACKEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 백엔드 서버 SSH 인증
                                sh """
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_BACKEND_HOST} "
                                        mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&  # 디렉토리가 없으면 생성
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose -f docker-compose.backend.yml pull stable_backend &&  # 안정 백엔드 이미지 다운로드
                                        docker compose -f docker-compose.backend.yml up -d --no-deps stable_backend &&  # 안정 백엔드 컨테이너 실행
                                        docker compose -f docker-compose.backend.yml stop canary_backend &&  # 카나리 백엔드 중지
                                        docker compose -f docker-compose.backend.yml rm -f canary_backend  # 카나리 백엔드 컨테이너 삭제
                                    "
                                """
                            }
                        },
                        "Frontend Promotion": {
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 프론트엔드 서버 SSH 인증
                                sh """
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_FRONTEND_HOST} "
                                        mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&  # 디렉토리가 없으면 생성
                                        cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                        docker compose -f docker-compose.frontend.yml pull stable_frontend &&  # 안정 프론트엔드 이미지 다운로드
                                        docker compose -f docker-compose.frontend.yml up -d --no-deps stable_frontend &&  # 안정 프론트엔드 컨테이너 실행
                                        docker compose -f docker-compose.frontend.yml stop canary_frontend &&  # 카나리 프론트엔드 중지
                                        docker compose -f docker-compose.frontend.yml rm -f canary_frontend  # 카나리 프론트엔드 컨테이너 삭제
                                    "
                                """
                            }
                        }
                    )

                    dir("${PROJECT_DIRECTORY}/nginx") {
                        writeFile file: 'nginx.conf', text: """
                            upstream backend {
                                server ${EC2_BACKEND_HOST}:8080;  // 안정 백엔드 서버로 100% 트래픽 전환
                            }
                            upstream frontend {
                                server ${EC2_FRONTEND_HOST}:3000;  // 안정 프론트엔드 서버로 100% 트래픽 전환
                            }
                            server {
                                listen 80;

                                # Next.js 서버로 프록시
                                location / {
                                    proxy_pass http://frontend;
                                    proxy_http_version 1.1;
                                    proxy_set_header Upgrade \$http_upgrade;
                                    proxy_set_header Connection 'upgrade';
                                    proxy_set_header Host \$host;
                                    proxy_cache_bypass \$http_upgrade;
                                    proxy_set_header X-Real-IP \$remote_addr;
                                    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                                    proxy_set_header X-Forwarded-Proto \$scheme;
                                }

                                # 정적 파일 제공 (Next.js 빌드된 파일)
                                location /_next/ {
                                    proxy_pass http://frontend;
                                    proxy_cache_valid 200 1h;
                                    proxy_set_header Cache-Control "public, max-age=31536000, immutable";
                                }

                                # API 요청을 백엔드로 전달
                                location /api/ {
                                    proxy_pass http://backend;
                                    proxy_http_version 1.1;
                                    proxy_set_header Upgrade \$http_upgrade;
                                    proxy_set_header Connection 'upgrade';
                                    proxy_set_header Host \$host;
                                    proxy_cache_bypass \$http_upgrade;
                                    proxy_set_header X-Real-IP \$remote_addr;
                                    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
                                    proxy_set_header X-Forwarded-Proto \$scheme;
                                }
                            }
                        """  // 안정 버전으로 전환된 Nginx 설정 파일 생성
                    }

                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 공용 서버 SSH 인증
                        sh """
                            scp -i \$SSH_KEY ${PROJECT_DIRECTORY}/nginx/nginx.conf ${EC2_USER}@${EC2_PUBLIC_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/nginx/  # Nginx 설정 파일 업로드
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&  # 디렉토리가 없으면 생성
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose -f docker-compose.infra.yml up -d nginx &&  # Nginx 컨테이너 실행
                                docker exec nginx_lb nginx -s reload  # Nginx 설정 리로드
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
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_BACKEND_HOST} "
                                mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&  # 디렉토리가 없으면 생성
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose -f docker-compose.backend.yml pull stable_backend &&  # 안정 백엔드 이미지 다운로드
                                docker compose -f docker-compose.backend.yml up -d --no-deps stable_backend  # 안정 백엔드 컨테이너 실행
                            "
                        """
                    }
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_FRONTEND_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {  // 프론트엔드 서버 SSH 인증
                        sh """
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_FRONTEND_HOST} "
                                mkdir -p /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&  # 디렉토리가 없으면 생성
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME} &&
                                docker compose -f docker-compose.frontend.yml pull stable_frontend &&  # 안정 프론트엔드 이미지 다운로드
                                docker compose -f docker-compose.frontend.yml up -d --no-deps stable_frontend  # 안정 프론트엔드 컨테이너 실행
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