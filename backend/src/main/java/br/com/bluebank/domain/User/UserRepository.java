package br.com.bluebank.domain.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface UserRepository extends JpaRepository<User, Integer>
{
    public List<User> findByEmailOrCpfCnpj(String email, String cpfCnpj);

    public Optional<User> findByCpfCnpj(String cpfCnpj);

    @Query("SELECT u FROM User AS u WHERE u.cpfCnpj = ?1")
    public User findByUsername(String username);
}