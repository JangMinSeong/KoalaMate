package com.ssafy.koala.config;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.jasypt.iv.RandomIvGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableEncryptableProperties
public class JasyptConfigAES {
    @Value("${jasypt.encryptor.password}")
    private String encryptionPassword;

    @Bean(name = "jasyptEncryptorAES")
    public StringEncryptor stringEncryptor() {
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();

        config.setPassword(encryptionPassword); // 암호화키
        config.setAlgorithm("PBEWithHMACSHA512AndAES_256"); // 암호화 알고리즘
        config.setIvGenerator(new RandomIvGenerator()); // PBE-AES 기반 알고리즘의 경우 IV 생성 필수
        config.setKeyObtentionIterations("1000"); // 반복할 해싱 회수
        config.setPoolSize("1"); // 인스턴스 pool
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator"); // salt 생성 클래스
        config.setStringOutputType("base64"); // 인코딩
        encryptor.setConfig(config);
        return encryptor;
    }
}
