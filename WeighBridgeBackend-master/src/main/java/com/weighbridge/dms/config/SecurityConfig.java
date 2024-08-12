package com.weighbridge.dms.config;

/*
 * import com.dms.DMS.service.Impl.CustomUserDetailService; import
 * org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.beans.factory.annotation.Value; import
 * org.springframework.context.annotation.Bean; import
 * org.springframework.context.annotation.Configuration; import
 * org.springframework.security.authentication.AuthenticationManager; import
 * org.springframework.security.authentication.AuthenticationProvider; import
 * org.springframework.security.authentication.dao.DaoAuthenticationProvider;
 * import
 * org.springframework.security.config.annotation.authentication.configuration.
 * AuthenticationConfiguration; import
 * org.springframework.security.config.annotation.web.builders.HttpSecurity;
 * import org.springframework.security.core.userdetails.User; import
 * org.springframework.security.core.userdetails.UserDetails; import
 * org.springframework.security.core.userdetails.UserDetailsService; import
 * org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; import
 * org.springframework.security.crypto.password.PasswordEncoder; import
 * org.springframework.security.provisioning.InMemoryUserDetailsManager; import
 * org.springframework.security.web.SecurityFilterChain;
 * 
 * @Configuration public class SecurityConfig {
 * 
 * @Value("${spring.security.user.name}") private String username;
 * 
 * @Value("${spring.security.user.password}") private String password;
 * 
 * @Autowired private CustomUserDetailService userDetailService;
 * 
 * @Bean public UserDetailsService userDetailsService() { UserDetails user =
 * User.withDefaultPasswordEncoder() .username(username) .password(password)
 * .build(); return new InMemoryUserDetailsManager(user); }
 * 
 * @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws
 * Exception { http .csrf(csrf -> csrf.disable()) // Disable CSRF protection
 * .authorizeHttpRequests(authorize -> authorize
 * .requestMatchers("/login","/api/v1/documents/retrieve/**",
 * "/api/v1/documents/createDirectory/**","/api/v1/documents/uploadDoc/**").
 * permitAll() // Allow public access to endpoints under /public/**
 * .anyRequest().authenticated() // All other endpoints require authentication )
 * .formLogin(formLogin -> formLogin.permitAll() // Custom login page )
 * .logout(logout -> logout.permitAll()); // Enable logout functionality
 * 
 * return http.build(); }
 * 
 * @Bean public AuthenticationProvider authenticationProvider() {
 * DaoAuthenticationProvider authenticationProvider = new
 * DaoAuthenticationProvider();
 * authenticationProvider.setUserDetailsService(userDetailService);
 * authenticationProvider.setPasswordEncoder(passwordEncoder()); return
 * authenticationProvider; }
 * 
 * @Bean public static PasswordEncoder passwordEncoder(){ return new
 * BCryptPasswordEncoder(); }
 * 
 * @Bean public AuthenticationManager
 * authenticationManager(AuthenticationConfiguration
 * authenticationConfiguration)throws Exception{ return
 * authenticationConfiguration.getAuthenticationManager(); }
 * 
 * }
 */