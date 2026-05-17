package com.cantinhonacional.jwt;

import com.cantinhonacional.security.UserSystem;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public JwtService(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    public String newToken(UserSystem user) {
        Instant now = Instant.now();
        int expirationInterval = 10;
        Instant expiration = now.plus(expirationInterval, ChronoUnit.HOURS);

        String role = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_CLIENT");

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("CantinhoNacional")
                .issuedAt(now)
                .expiresAt(expiration)
                .subject(user.getUsername())
                .claim("name", user.getName())
                .claim("id", user.getId())
                .claim("role", role)
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();

        try {
            Jwt jwt = this.jwtEncoder.encode(JwtEncoderParameters.from(header, claims));
            return jwt.getTokenValue();
        } catch (JwtEncodingException ex) {
            throw new RuntimeException("Erro ao gerar token JWT", ex);
        }
    }

    private Jwt decodedToken(String token) {
        return this.jwtDecoder.decode(token);
    }

    public UserSystem getUSerInToken(String token) {
        Jwt jwt = decodedToken(token);
        String email = jwt.getSubject();
        String name = jwt.getClaim("name").toString();
        String id = jwt.getClaim("id").toString();
        String role = jwt.getClaim("role").toString();

        return new UserSystem(id, name, email, role);
    }
}