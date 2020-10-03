package br.com.bluebank.domain.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Integer>
{
    @Query("SELECT u.password FROM User AS u WHERE u.id = ?1")
    public String findUserPasswordById(Integer id);

    public List<User> findByEmailOrCpfCnpj(String email, String cpfCnpj);
}