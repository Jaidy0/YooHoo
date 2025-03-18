pipeline {
    agent none
    options {
        disableConcurrentBuilds()
    }
    environment {
        DOCKER_IMAGE_PREFIX = "murhyun2"
        EC2_HOST = "i12b204.p.ssafy.io"
        COMPOSE_PROJECT_NAME = "yoohoo"
        EC2_SSH_CREDENTIALS_ID = "ec2-ssh-key"
        GIT_CREDENTIALS_ID = "gitlab-token"
        GIT_REPOSITORY_URL = "https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21B209"
        PROJECT_DIRECTORY = "jenkins"
        EC2_USER = "ubuntu"
        DOCKER_HUB_CREDENTIALS_ID = "dockerhub-token"
        STABLE_TAG = "stable-${env.BUILD_NUMBER}"
        CANARY_TAG = "canary-${env.BUILD_NUMBER}"
        TRAFFIC_SPLIT = 10 // 초기 카나리 트래픽 비율 (%)
    }
    stages {
        stage('Checkout') {
            agent any
            steps {
                git branch: "develop", credentialsId: "${GIT_CREDENTIALS_ID}", url: "${GIT_REPOSITORY_URL}"
            }
        }

        stage('Prepare Environment') {
            agent any
            steps {
                withCredentials([file(credentialsId: 'env-file-content', variable: 'ENV_FILE_PATH')]) {
                    script {
                        def envContent = readFile(ENV_FILE_PATH)
                        dir("${PROJECT_DIRECTORY}") {
                            writeFile file: '.env', text: envContent
                        }
                    }
                }
            }
        }

        stage('Build & Push Images') {
            parallel {
                stage('Build Backend') {
                    agent { label 'backend-dev' }
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
                                dir("${PROJECT_DIRECTORY}") {
                                    sh """
                                        docker compose build --no-cache canary_backend
                                        docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:latest ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG}
                                        docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG}
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Build Frontend') {
                    agent { label 'frontend-dev' }
                    steps {
                        script {
                            docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
                                dir("${PROJECT_DIRECTORY}") {
                                    sh """
                                        docker compose build --no-cache canary_frontend
                                        docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:latest ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG}
                                        docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG}
                                    """
                                }
                            }
                        }
                    }
                }
                stage('Configure Nginx') {
                    agent { label 'public-dev' }
                    steps {
                        script {
                            dir("${PROJECT_DIRECTORY}/nginx") {
                                def nginxConfig = """
                                    upstream backend {
                                        server stable_backend:8080 weight=${100 - TRAFFIC_SPLIT};
                                        server canary_backend:8080 weight=${TRAFFIC_SPLIT};
                                    }
                                    upstream frontend {
                                        server stable_frontend:80 weight=${100 - TRAFFIC_SPLIT};
                                        server canary_frontend:80 weight=${TRAFFIC_SPLIT};
                                    }
                                    server {
                                        listen 80;
                                        location /api {
                                            proxy_pass http://backend;
                                        }
                                        location / {
                                            proxy_pass http://frontend;
                                        }
                                    }
                                """
                                writeFile file: 'nginx.conf', text: nginxConfig
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy Canary') {
            agent any
            options {
                lock('ec2-deployment-lock')
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: "${EC2_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY_FILE')]) {
                    sh """
                        scp -i ${SSH_KEY_FILE} ${PROJECT_DIRECTORY}/nginx/nginx.conf ${EC2_USER}@${EC2_HOST}:/home/${EC2_USER}/${COMPOSE_PROJECT_NAME}/nginx/
                        ssh -i ${SSH_KEY_FILE} ${EC2_USER}@${EC2_HOST} "
                            cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                            docker compose pull canary_backend canary_frontend
                            docker compose up -d --no-deps canary_backend canary_frontend nginx
                            docker exec nginx_lb nginx -s reload
                        "
                    """
                }
            }
        }

        stage('Approval') {
            agent any
            steps {
                input message: '카나리 테스트를 승인하시겠습니까?', ok: '프로덕션 배포'
            }
        }

        stage('Promote to Stable') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
                        sh """
                            docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-backend:${CANARY_TAG} ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-backend:${STABLE_TAG}
                            docker tag ${DOCKER_IMAGE_PREFIX}/yoohoo-canary-frontend:${CANARY_TAG} ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-frontend:${STABLE_TAG}
                            docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-backend:${STABLE_TAG}
                            docker push ${DOCKER_IMAGE_PREFIX}/yoohoo-stable-frontend:${STABLE_TAG}
                        """
                    }
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY_FILE')]) {
                        sh """
                            ssh -i ${SSH_KEY_FILE} ${EC2_USER}@${EC2_HOST} '
                                cd /home/${EC2_USER}/${COMPOSE_PROJECT_NAME}
                                docker compose pull stable_backend stable_frontend
                                docker compose up -d --no-deps stable_backend stable_frontend nginx
                                docker compose stop canary_backend canary_frontend
                                docker compose rm -f canary_backend canary_frontend
                                docker exec nginx_lb nginx -s reload
                            '
                        """
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                // Git 관련 정보 수집
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Email = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def Commit_Message = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                def Branch_Name = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()

                // 빌드 시작 시간 및 소요 시간 포맷팅
                def Build_Time = new Date(currentBuild.startTimeInMillis)
                    .format("yyyy년 MM월 dd일 HH시 mm분 ss초", TimeZone.getTimeZone("Asia/Seoul"))
                def Duration = currentBuild.durationString.replace(' and counting', '')

                // 빌드 결과 및 표시 색상/아이콘 결정
                def Status = currentBuild.result ?: "SUCCESS"
                def Color = (Status == "SUCCESS") ? 'good' : 'danger'
                def Icon = (Status == "SUCCESS") ? "✅" : "❌"

                // 메시지 구성
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

                // Mattermost로 알림 전송
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


