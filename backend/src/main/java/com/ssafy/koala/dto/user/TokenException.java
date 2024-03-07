package com.ssafy.koala.dto.user;

import org.springframework.security.core.AuthenticationException;

public class TokenException extends AuthenticationException {

    public TokenException(String msg) {
        super(msg);
    }
    public TokenException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
