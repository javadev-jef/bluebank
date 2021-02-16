package br.com.bluebank.domain.user;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import br.com.bluebank.domain.User.User;
import br.com.bluebank.domain.User.User.PersonType;
import br.com.bluebank.domain.User.UserRepository;

@DataJpaTest
@ActiveProfiles(value = "test")
public class UserRepositoryTest 
{
    @Autowired
    private UserRepository userRepository;

    @Test
    public void save()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(3131307);
        user.setCpfCnpj("44570645054");
        user.setEmail("usuario@email.com.br");
        user.setName("Jose Carlos Augusto");
        user.setPassword("654321");
        user.setPersonType(PersonType.CPF);
        user.setStateId(31);

        userRepository.saveAndFlush(user);
        assertNotNull(user.getId());
    }

    @Test
    public void findByUsername()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(313);
        user.setCpfCnpj("76816462050");
        user.setEmail("pedro@email.com.br");
        user.setName("Pedro da Silva");
        user.setPassword("987456");
        user.setPersonType(PersonType.CPF);
        user.setStateId(36);

        String username = "76816462050";

        userRepository.saveAndFlush(user);
        User userBD = userRepository.findByUsername(username);

        assertNotNull(userBD);
        assertNotNull(userBD.getId());
        assertEquals(username, userBD.getCpfCnpj());
    }

    @Test
    public void findByCpfCnpj()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(215);
        user.setCpfCnpj("47808759007");
        user.setEmail("maria@email.com.br");
        user.setName("Maria Valentina");
        user.setPassword("7563159");
        user.setPersonType(PersonType.CPF);
        user.setStateId(24);

        String cpfCnpj = "47808759007";

        userRepository.saveAndFlush(user);
        Optional<User> optionalUser = userRepository.findByCpfCnpj(cpfCnpj);

        assertTrue(optionalUser.isPresent());
        assertNotNull(optionalUser.get().getId());
        assertEquals(cpfCnpj, optionalUser.get().getCpfCnpj());
    }

    @Test
    public void findByEmailOrCpfCnpj()
    {
        User user = new User();
        user.setBirthDate(LocalDate.now().minusYears(1));
        user.setCityId(15);
        user.setCpfCnpj("27433507000195");
        user.setEmail("empresa@email.com.br");
        user.setName("Empresa Ltda");
        user.setPassword("75*/1269-");
        user.setPersonType(PersonType.CNPJ);
        user.setStateId(47);
        userRepository.saveAndFlush(user);

        user = new User();
        user.setBirthDate(LocalDate.now().minusYears(18));
        user.setCityId(15);
        user.setCpfCnpj("54692213000");
        user.setEmail("joaquim@email.com.br");
        user.setName("Joaquim Fernandes");
        user.setPassword("123456");
        user.setPersonType(PersonType.CPF);
        user.setStateId(47);
        userRepository.saveAndFlush(user);

        String cpfCnpj = "27433507000195";
        String email = "joaquim@email.com.br";

        List<User> users = userRepository.findByEmailOrCpfCnpj(null, cpfCnpj);
        Assertions.assertThat(users).hasSize(1);

        users = userRepository.findByEmailOrCpfCnpj(email, null);
        Assertions.assertThat(users).hasSize(1);

        users = userRepository.findByEmailOrCpfCnpj(email, cpfCnpj);
        Assertions.assertThat(users).hasSize(2);
    }
}