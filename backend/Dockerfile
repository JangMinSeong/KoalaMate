q# 첫 번째 스테이지: 빌드 환경 설정
FROM gradle:8.5.0-jdk17-alpine AS build

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# Gradle 래퍼 파일과 소스 코드 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Gradle을 사용하여 애플리케이션 빌드
RUN gradle build -x test

# 두 번째 스테이지: 실행 환경 설정
FROM azul/zulu-openjdk:17

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 빌드 스테이지에서 생성된 실행 가능한 JAR 파일을 /app 디렉토리로 복사
COPY --from=build /app/build/libs/*SNAPSHOT.jar app.jar

# 컨테이너 실행 시 실행될 명령
ENTRYPOINT ["java", "-jar", "app.jar"]

# 애플리케이션 포트 노출
EXPOSE 8080