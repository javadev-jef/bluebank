package br.com.bluebank.application.service;


import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import br.com.bluebank.application.service.exception.ValidationException;
import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.UserRepository;
import br.com.bluebank.domain.User.User.PersonType;

@SpringBootTest
@ActiveProfiles(value = "test")
public class UserServiceTest 
{
    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @Test
    public void save_whenHasDuplicateEmailAndCpfCnpj() throws ValidationException
    {
        assertNotNull(userRepository);
        assertNotNull(userService);

        User user01 = new User();
        user01.setId(1);
        user01.setBirthDate(LocalDate.now().minusYears(18));
        user01.setCityId(3131307);
        user01.setCpfCnpj("44570645054");
        user01.setEmail("usuario@email.com.br");
        user01.setName("Jose Carlos Augusto");
        user01.setPassword("654321");
        user01.setPersonType(PersonType.CPF);
        user01.setStateId(31);

        Mockito.when(userRepository.findByEmailOrCpfCnpj(user01.getEmail(), user01.getCpfCnpj())).thenReturn(List.of(user01));

        User user02 = new User();
        user02.setBirthDate(LocalDate.now().minusYears(1));
        user02.setCityId(4106902);
        user02.setCpfCnpj("44570645054");
        user02.setEmail("usuario@email.com.br");
        user02.setName("Empresa LTDA");
        user02.setPassword("123456");
        user02.setPersonType(PersonType.CNPJ);
        user02.setStateId(41);

        assertThrows(ValidationException.class, () -> userService.save(user02));
    }
}