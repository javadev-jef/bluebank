package br.com.bluebank.domain.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Integer>
{
    @Query("SELECT u.password FROM User AS u WHERE u.id = ?1")
    public String findUserPasswordById(Integer id);
}