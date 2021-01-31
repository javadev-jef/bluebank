package br.com.bluebank.domain.Coin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface CoinRepository extends JpaRepository<Coin, Integer>
{

}
