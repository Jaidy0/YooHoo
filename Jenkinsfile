pipeline {
	agent none
    options {
		disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }
    parameters {
		string(name: 'TRAFFIC_SPLIT', defaultValue: '10', description: '카나리 배포 시 트래픽 비율 (%)')
    }
    environment {
		DOCKER_IMAGE_PREFIX = "murhyun2"
        EC2_PUBLIC_HOST = ""
        STABLE_BACKEND_PORT = ""
        CANARY_BACKEND_PORT = ""
        STABLE_FRONTEND_PORT = ""
        CANARY_FRONTEND_PORT = ""
        PROMETHEUS_PORT = ""
        REDIS_PASSWORD = ""
        EC2_PUBLIC_SSH_CREDENTIALS_ID = "ec2-ssh-key"
        GIT_CREDENTIALS_ID = "gitlab-token"
        GIT_REPOSITORY_URL = "https://lab.ssafy.com/s12-fintech-finance-sub1/S12P21B209"
        PROJECT_DIRECTORY = "YooHoo"
        EC2_USER = "ubuntu"
        DOCKER_HUB_CREDENTIALS_ID = "dockerhub-token"
        STABLE_TAG = "stable-${env.BUILD_NUMBER}"
        CANARY_TAG = "canary-${env.BUILD_NUMBER}"
        NEXT_PUBLIC_API_URL=""
        NEXT_PUBLIC_KAKAO_CLIENT_ID=""
        NEXT_PUBLIC_KAKAO_REDIRECT_URI=""
        BACKEND_IMAGE = "${DOCKER_IMAGE_PREFIX}/yoohoo-backend"
        FRONTEND_IMAGE = "${DOCKER_IMAGE_PREFIX}/yoohoo-frontend"
        STABLE_WEIGHT = "${100 - params.TRAFFIC_SPLIT.toInteger()}"
        CANARY_WEIGHT = "${params.TRAFFIC_SPLIT.toInteger()}"
        ERROR_RATE_THRESHOLD = 1.0 // 오류율 임계값 (%)
        RESPONSE_TIME_THRESHOLD = 0.2 // 응답 시간 임계값 (초)
        MONITORING_DURATION = 60 // 모니터링 지속 시간 (초)
    }
    stages {
		stage('Checkout') {
			agent any
            steps {
				sh 'rm -f .git/index.lock || true'
                retry(3) {
					git branch: "develop",
                        credentialsId: "${GIT_CREDENTIALS_ID}",
                        url: "${GIT_REPOSITORY_URL}"
                }
            }
        }
        stage('Prepare Environment') {
			agent any
            steps {
				withCredentials([file(credentialsId: 'env-file-content', variable: 'ENV_FILE_PATH')]) {
					script {
						def envContent = readFile(ENV_FILE_PATH).replaceAll('\r', '')
                        def extraEnv = """
                        DOCKER_IMAGE_PREFIX=${DOCKER_IMAGE_PREFIX}
                        STABLE_TAG=stable-${BUILD_NUMBER}
                        CANARY_TAG=canary-${BUILD_NUMBER}
                        BACKEND_IMAGE=${DOCKER_IMAGE_PREFIX}/yoohoo-backend
                        FRONTEND_IMAGE=${DOCKER_IMAGE_PREFIX}/yoohoo-frontend
                        """
                        def finalEnvContent = envContent + "\n" + extraEnv.trim()
                        writeFile file: '.env', text: finalEnvContent
                        def envMap = [:]
                        finalEnvContent.split('\n').each { line ->
                            def keyValue = line.split('=', 2)
                            if (keyValue.size() == 2) {
							envMap[keyValue[0].trim()] = keyValue[1].trim()
                            }
                        }
                        EC2_PUBLIC_HOST = envMap['EC2_PUBLIC_HOST']
                        STABLE_BACKEND_PORT = envMap['STABLE_BACKEND_PORT']
                        CANARY_BACKEND_PORT = envMap['CANARY_BACKEND_PORT']
                        STABLE_FRONTEND_PORT = envMap['STABLE_FRONTEND_PORT']
                        CANARY_FRONTEND_PORT = envMap['CANARY_FRONTEND_PORT']
                        PROMETHEUS_PORT = envMap['PROMETHEUS_PORT']
                        REDIS_PASSWORD = envMap['REDIS_PASSWORD']
                        NEXT_PUBLIC_API_URL = envMap['NEXT_PUBLIC_API_URL']
                        NEXT_PUBLIC_KAKAO_CLIENT_ID = envMap['NEXT_PUBLIC_KAKAO_CLIENT_ID']
                        NEXT_PUBLIC_KAKAO_REDIRECT_URI = envMap['NEXT_PUBLIC_KAKAO_REDIRECT_URI']
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
								dir("backend") {
									sh """
                                        docker build -t ${BACKEND_IMAGE}:${CANARY_TAG} .
                                        docker push ${BACKEND_IMAGE}:${CANARY_TAG}
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
								dir("frontend") {
									sh """
                                        docker build \\
                                            --build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \\
                                            --build-arg NEXT_PUBLIC_KAKAO_CLIENT_ID=${NEXT_PUBLIC_KAKAO_CLIENT_ID} \\
                                            --build-arg NEXT_PUBLIC_KAKAO_REDIRECT_URI=${NEXT_PUBLIC_KAKAO_REDIRECT_URI} \\
                                            -t ${FRONTEND_IMAGE}:${CANARY_TAG} .
                                        docker push ${FRONTEND_IMAGE}:${CANARY_TAG}
                                    """
                                }
                            }
                        }
                    }
                }
            }
        }
        stage('Deploy Canary') {
			agent { label 'public-dev' } // Jenkins 에이전트가 서버 1이라고 가정
            steps {
				script {
					sh """
                        # gettext 설치 확인 및 설치
                        if ! dpkg -s gettext > /dev/null 2>&1; then
                            sudo apt-get update && sudo apt-get install -y gettext
                        fi

                        # .env 파일 로드
                        set -a
                        . \${WORKSPACE}/.env
                        set +a

                        # Nginx 설정 파일 생성
                        echo "Generating Nginx config..."
                        envsubst '\$EC2_PUBLIC_HOST \$STABLE_BACKEND_PORT \$CANARY_BACKEND_PORT \$STABLE_FRONTEND_PORT \$CANARY_FRONTEND_PORT \$STABLE_WEIGHT \$CANARY_WEIGHT' < \${WORKSPACE}/nginx/nginx.develop.conf.template > ./nginx/nginx.conf

                        # Docker Compose 실행 또는 Nginx 리로드
                        if ! docker ps --filter "name=nginx_lb" --filter "status=running" | grep -q "nginx_lb"; then
                            echo "nginx_lb 컨테이너가 실행 중이지 않습니다. 시작합니다."

                            # Prometheus 설정 파일 생성
                            echo "Generating Prometheus config..."
                            envsubst < \${WORKSPACE}/prometheus.develop.template.yml > ./prometheus.yml

                            # Redis 설정 파일 생성
                            echo "Generating Redis config..."
                            envsubst < \${WORKSPACE}/redis/redis.conf.template > ./redis/redis.conf

                            # --- Redis TLS 인증서 준비 단계 (최초 실행 시에만 수행) ---
                            echo "Preparing Redis TLS certificates (first run)..."

                            # 1. Redis용 인증서 디렉토리 생성 (/opt/redis-certs)
                            echo "Creating directory /opt/redis-certs..."
                            sudo mkdir -p /opt/redis-certs
                            sudo chmod 755 /opt/redis-certs

                            # 2. Let's Encrypt 인증서 복사 (redis.crt, redis.key 이름으로)
                            echo "Copying Let's Encrypt certificates..."
                            sudo cp /etc/letsencrypt/live/j12b209.p.ssafy.io/fullchain.pem /opt/redis-certs/redis.crt || echo "WARN: Failed to copy fullchain.pem"
                            sudo cp /etc/letsencrypt/live/j12b209.p.ssafy.io/privkey.pem /opt/redis-certs/redis.key || echo "WARN: Failed to copy privkey.pem"

                            # 3. 복사된 파일 권한 조정 (redis 컨테이너가 읽을 수 있도록)
                            echo "Setting permissions for copied certificates..."
                            # 파일이 성공적으로 복사되었는지 확인 후 권한 변경
                            if [ -f /opt/redis-certs/redis.crt ]; then sudo chmod 644 /opt/redis-certs/redis.crt; fi
                            if [ -f /opt/redis-certs/redis.key ]; then
                                sudo chmod 644 /opt/redis-certs/redis.key
                            fi
                            echo "Redis TLS certificate preparation finished."
                            # --- Redis TLS 인증서 준비 단계 끝 ---

                            # 전체 서비스 시작
                            echo "Starting all services..."
                            docker compose -f docker-compose.develop.yml up -d mysql redis nginx canary_backend canary_frontend prometheus grafana node-exporter cadvisor
                        else
                            echo "nginx_lb 컨테이너가 실행 중입니다. 카나리 및 Nginx 리로드를 수행합니다."
                            docker compose -f docker-compose.develop.yml up -d canary_backend canary_frontend
                            docker exec nginx_lb nginx -s reload
                        fi
                    """
                }
            }
        }
        stage('Monitor Canary with Prometheus') {
            agent { label 'public-dev' }
            steps {
                script {
                    sleep(20) // 카나리 배포 후 안정화 대기 (20초)

                    def trafficPercentages = [10, 30, 60, 100]
                    def overallSuccess = true

                    for (def percent in trafficPercentages) {
                        echo "카나리 버전으로 트래픽을 ${percent}%로 설정합니다..."
                        // NGINX 설정 업데이트: 트래픽 비율에 따라 분배

                        def stableWeight = 100 - percent
                        def canaryWeight = percent

                        if (percent == 100) {
                            sh """
                                set -a
                                . \${WORKSPACE}/.env
                                set +a
                                envsubst '\$EC2_PUBLIC_HOST \$STABLE_BACKEND_PORT \$CANARY_BACKEND_PORT \$STABLE_FRONTEND_PORT \$CANARY_FRONTEND_PORT' < \${WORKSPACE}/nginx/nginx.canary.develop.conf.template > ./nginx/nginx.conf
                                docker exec nginx_lb nginx -s reload
                            """
                        } else {
                            withEnv(["STABLE_WEIGHT=${stableWeight}", "CANARY_WEIGHT=${canaryWeight}"]) {
                                echo "환경 변수 설정: STABLE_WEIGHT=${env.STABLE_WEIGHT}, CANARY_WEIGHT=${env.CANARY_WEIGHT}"
                                sh """
                                    set -a
                                    . \${WORKSPACE}/.env
                                    set +a
                                    envsubst '\$EC2_PUBLIC_HOST \$STABLE_BACKEND_PORT \$CANARY_BACKEND_PORT \$STABLE_FRONTEND_PORT \$CANARY_FRONTEND_PORT \$STABLE_WEIGHT \$CANARY_WEIGHT' < \${WORKSPACE}/nginx/nginx.develop.conf.template > ./nginx/nginx.conf
                                    docker exec nginx_lb nginx -s reload
                                """
                            }
                        }

                        echo "카나리 버전을 ${percent}% 트래픽으로 모니터링합니다..."
                        def startTime = System.currentTimeMillis()
                        def endTime = startTime + (env.MONITORING_DURATION.toLong() * 1000) // 모니터링 지속 시간
                        def stageSuccess = true

                        parallel(
                            "Generate Traffic": {
                                script {
                                    def duration = env.MONITORING_DURATION.toInteger()
                                    echo "카나리 버전을 ${percent}% 트래픽으로 설정. 트래픽을 생성합니다..."
                                    sh """
                                        for i in \$(seq 1 ${duration}); do
                                            curl -s http://${EC2_PUBLIC_HOST}/api/actuator/health || true
                                            sleep 1
                                        done
                                    """
                                    echo "테스트 트래픽 생성 완료!"
                                }
                            },
                            "Monitor Metrics": {
                                script {
                                    def metricCheckStart = System.currentTimeMillis()
                                    echo "카나리 버전을 ${percent}% 트래픽으로 모니터링합니다..."

                                    while (System.currentTimeMillis() < endTime) {
                                        try {
                                            def upQuery = "up{job=\"backend-canary\"}"
                                            def encodedUpQuery = URLEncoder.encode(upQuery, "UTF-8")
                                            def upResponse = sh(script: "curl -s \"http://${EC2_PUBLIC_HOST}:${PROMETHEUS_PORT}/api/v1/query?query=${encodedUpQuery}\"", returnStdout: true).trim()
                                            echo "Up Status Response: ${upResponse}"

                                            def upJson = readJSON(text: upResponse)
                                            def isUp = false

                                            if (upJson.data.result && !upJson.data.result.isEmpty()) {
                                                for (def result in upJson.data.result) {
                                                    if (result.metric.job == "backend-canary" && result.value[1] == "1") {
                                                        isUp = true
                                                        break
                                                    }
                                                }
                                            }

                                            if (!isUp) {
                                                echo "backend-canary 서비스가 아직 준비되지 않았습니다. 대기 중..."
                                                sleep(10)
                                                continue
                                            }

                                            def timeRange = "5m"

                                            def errorRateQuery = "sum(rate(http_server_requests_seconds_count{outcome=\"SERVER_ERROR\", job=\"backend-canary\"}[${timeRange}])) / sum(rate(http_server_requests_seconds_count{job=\"backend-canary\"}[${timeRange}])) * 100"
                                            def encodedQuery = URLEncoder.encode(errorRateQuery, "UTF-8")
                                            def errorRateResponse = sh(script: "curl -s \"http://${EC2_PUBLIC_HOST}:${PROMETHEUS_PORT}/api/v1/query?query=${encodedQuery}\"", returnStdout: true).trim()
                                            echo "Error Rate Response: ${errorRateResponse}"

                                            def errorRateJson = readJSON(text: errorRateResponse)
                                            def errorRate = 0.0
                                            def hasErrorRateMetric = false

                                            if (errorRateJson.data.result && !errorRateJson.data.result.isEmpty()) {
                                                hasErrorRateMetric = true
                                                errorRate = errorRateJson.data.result[0].value[1].toFloat()
                                            } else {
                                                errorRate = 0.0
                                                hasErrorRateMetric = true
                                            }

                                            def responseTimeQuery = "sum(rate(http_server_requests_seconds_sum{job=\"backend-canary\"}[${timeRange}])) / sum(rate(http_server_requests_seconds_count{job=\"backend-canary\"}[${timeRange}]))"
                                            def encodedRespTimeQuery = URLEncoder.encode(responseTimeQuery, "UTF-8")
                                            def responseTimeResponse = sh(script: "curl -s \"http://${EC2_PUBLIC_HOST}:${PROMETHEUS_PORT}/api/v1/query?query=${encodedRespTimeQuery}\"", returnStdout: true).trim()
                                            echo "Response Time Response: ${responseTimeResponse}"

                                            def responseTimeJson = readJSON(text: responseTimeResponse)
                                            def responseTime = 0.0
                                            def hasResponseTimeMetric = false

                                            if (responseTimeJson.data.result && !responseTimeJson.data.result.isEmpty()) {
                                                hasResponseTimeMetric = true
                                                if (responseTimeJson.data.result[0]?.value && responseTimeJson.data.result[0].value.size() > 1) {
                                                    responseTime = responseTimeJson.data.result[0].value[1].toFloat()
                                                }
                                            }

                                            if (!hasErrorRateMetric || !hasResponseTimeMetric) {
                                                def elapsedTime = System.currentTimeMillis() - metricCheckStart
                                                def remainingTime = 60000 - elapsedTime

                                                if (elapsedTime > 60000) {
                                                    error("❌ 카나리 모니터링 실패: 1분 이상 메트릭이 수집되지 않았습니다!")
                                                }

                                                echo "메트릭이 아직 수집되지 않았습니다. 대기 중... (제한 시간까지 ${remainingTime / 1000}초 남음)"
                                                sleep(10)
                                                continue
                                            }

                                            echo "현재 오류율: ${errorRate}%, 응답 시간: ${responseTime}초"

                                            if (errorRate > env.ERROR_RATE_THRESHOLD.toFloat() || responseTime > env.RESPONSE_TIME_THRESHOLD.toFloat()) {
                                                stageSuccess = false
                                                error("❌ 카나리 모니터링 실패: 오류율(${errorRate}%) 또는 응답 시간(${responseTime}초)이 임계값을 초과했습니다!")
                                            }

                                            sleep(10)
                                        } catch (Exception e) {
                                            echo "모니터링 중 오류 발생: ${e.message}"
                                            if (e.message.contains("카나리 모니터링 실패")) {
                                                throw e
                                            }
                                            sleep(10)
                                        }
                                    }

                                    if (stageSuccess) {
                                        echo "✅ 카나리 모니터링 성공: ${percent}% 트래픽에서 모든 메트릭이 정상 범위 내에 있습니다."
                                    }
                                }
                            }
                        )
                        if (!stageSuccess) {
                            overallSuccess = false
                            error("❌ ${percent}% 트래픽에서 카나리 모니터링 실패!")
                        }
                        // 100% 트래픽에서 성공 시 메세지
                        if (percent == 100 && overallSuccess) {
                            echo "✅ 모든 모니터링 단계가 성공했습니다. 모든 트래픽이 카나리 버전으로 전환되었습니다."
                        }
                    }
                }
            }
        }
        stage('Promote to Stable') {
			parallel {
				stage('Backend Promotion') {
					agent { label 'backend-dev' }
                    steps {
						script {
							docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
								sh """
                                    docker tag ${BACKEND_IMAGE}:${CANARY_TAG} ${BACKEND_IMAGE}:${STABLE_TAG}
                                    docker tag ${BACKEND_IMAGE}:${CANARY_TAG} ${BACKEND_IMAGE}:latest
                                    docker push ${BACKEND_IMAGE}:${STABLE_TAG}
                                    docker push ${BACKEND_IMAGE}:latest
                                """
                            }
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
								sh """
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                        cd ${WORKSPACE} &&
                                        docker compose -f docker-compose.develop.yml pull stable_backend &&
                                        docker compose -f docker-compose.develop.yml up -d --no-deps stable_backend
                                    "
                                """
                            }
                        }
                    }
                }
                stage('Frontend Promotion') {
					agent { label 'frontend-dev' }
                    steps {
						script {
							docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_HUB_CREDENTIALS_ID}") {
								sh """
                                    docker tag ${FRONTEND_IMAGE}:${CANARY_TAG} ${FRONTEND_IMAGE}:${STABLE_TAG}
                                    docker tag ${FRONTEND_IMAGE}:${CANARY_TAG} ${FRONTEND_IMAGE}:latest
                                    docker push ${FRONTEND_IMAGE}:${STABLE_TAG}
                                    docker push ${FRONTEND_IMAGE}:latest
                                """
                            }
                            withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
								sh """
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                        cd ${WORKSPACE} &&
                                        docker compose -f docker-compose.develop.yml pull stable_frontend &&
                                        docker compose -f docker-compose.develop.yml up -d --no-deps stable_frontend
                                    "
                                """
                            }
                        }
                    }
                }
            }
        }
        stage('Update Nginx') {
			agent { label 'public-dev' }
            steps {
				script {
					withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
						sh """
                            set -a
                            . \${WORKSPACE}/.env
                            set +a
                            envsubst '\$EC2_PUBLIC_HOST \$STABLE_BACKEND_PORT \$CANARY_BACKEND_PORT \$STABLE_FRONTEND_PORT \$CANARY_FRONTEND_PORT' < \${WORKSPACE}/nginx/nginx.stable.develop.conf.template > ./nginx/nginx.conf
                            docker exec nginx_lb nginx -s reload
                        """
                    }
                }
            }
        }
        stage('Cleanup Canary') {
			parallel {
				stage('Backend Canary Cleanup') {
					agent { label 'backend-dev' }
                    steps {
						script {
							withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
								sh """
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                        cd ${WORKSPACE} &&
                                        docker compose -f docker-compose.develop.yml stop canary_backend &&
                                        docker compose -f docker-compose.develop.yml rm -f canary_backend
                                    "
                                """
                            }
                        }
                    }
                }
                stage('Frontend Canary Cleanup') {
					agent { label 'frontend-dev' }
                    steps {
						script {
							withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
								sh """
                                    ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                        cd ${WORKSPACE} &&
                                        docker compose -f docker-compose.develop.yml stop canary_frontend &&
                                        docker compose -f docker-compose.develop.yml rm -f canary_frontend
                                    "
                                """
                            }
                        }
                    }
                }
            }
        }
    }
    post {
		failure {
			node('public-dev') {
				echo "배포 실패: 롤백을 진행합니다."
                script {
					withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
						sh """
                            set -a
                            . \${WORKSPACE}/.env
                            set +a
                            envsubst '\$EC2_PUBLIC_HOST \$STABLE_BACKEND_PORT \$CANARY_BACKEND_PORT \$STABLE_FRONTEND_PORT \$CANARY_FRONTEND_PORT' < \${WORKSPACE}/nginx/nginx.stable.develop.conf.template > ./nginx/nginx.conf
                            docker exec nginx_lb nginx -s reload
                        """
                    }
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
						sh """
                            ssh -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd ${WORKSPACE}
                                docker compose -f docker-compose.develop.yml up -d stable_backend
                            "
                        """
                    }
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
						sh """
                            ssh -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd ${WORKSPACE}
                                docker compose -f docker-compose.develop.yml up -d stable_frontend
                            "
                        """
                    }
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
						sh """
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd ${WORKSPACE}
                                docker compose -f docker-compose.develop.yml stop canary_backend
                                docker compose -f docker-compose.develop.yml rm -f canary_backend
                            "
                        """
                    }
                    withCredentials([sshUserPrivateKey(credentialsId: "${EC2_PUBLIC_SSH_CREDENTIALS_ID}", keyFileVariable: 'SSH_KEY')]) {
						sh """
                            ssh -o StrictHostKeyChecking=no -i \$SSH_KEY ${EC2_USER}@${EC2_PUBLIC_HOST} "
                                cd ${WORKSPACE}
                                docker compose -f docker-compose.develop.yml stop canary_frontend
                                docker compose -f docker-compose.develop.yml rm -f canary_frontend
                            "
                        """
                    }
                }
            }
        }
        always {
			node('public-dev') {
				sh """
                    docker images --format "{{.Repository}}:{{.Tag}}" | grep "${BACKEND_IMAGE}:stable-[0-9]\\+" | sort -t- -k3 -n | head -n -3 | xargs -r docker rmi || true
                    docker images --format "{{.Repository}}:{{.Tag}}" | grep "${BACKEND_IMAGE}:canary-" | xargs -r docker rmi || true
                """
                sh """
                    docker images --format "{{.Repository}}:{{.Tag}}" | grep "${FRONTEND_IMAGE}:stable-[0-9]\\+" | sort -t- -k3 -n | head -n -3 | xargs -r docker rmi || true
                    docker images --format "{{.Repository}}:{{.Tag}}" | grep "${FRONTEND_IMAGE}:canary-" | xargs -r docker rmi || true
                """
                script {
					def Branch_Name = env.GIT_BRANCH ? env.GIT_BRANCH.replace('origin/', '') : sh(script: "git name-rev --name-only HEAD | sed 's/^origin\\///'", returnStdout: true).trim()
                    def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                    def Author_Email = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                    def Commit_Message = sh(script: "git log -1 --pretty=%s", returnStdout: true).trim()
                    def Build_Time = new Date(currentBuild.startTimeInMillis).format("yyyy년 MM월 dd일 HH시 mm분 ss초", TimeZone.getTimeZone("Asia/Seoul"))
                    def Duration = currentBuild.durationString.replace(' and counting', '')
                    def Status = currentBuild.result ?: "SUCCESS"
                    def Color = (Status == "SUCCESS") ? 'good' : 'danger'
                    def Icon = (Status == "SUCCESS") ? "✅" : "❌"
                    def BlueOcean_URL = "${env.JENKINS_URL}blue/organizations/jenkins/${env.JOB_NAME}/detail/${env.JOB_NAME}/${env.BUILD_NUMBER}/pipeline/"
                    def Message = """\
                    ${Icon} *BUILD ${Status}*
                    - *Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
                    - *Branch:* ${Branch_Name}
                    - *Author:* ${Author_ID} (${Author_Email})
                    - *Commit:* ${Commit_Message}
                    - *시작 시간:* ${Build_Time}
                    - *소요 시간:* ${Duration}
                    [🔍 *Details*](${BlueOcean_URL})
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