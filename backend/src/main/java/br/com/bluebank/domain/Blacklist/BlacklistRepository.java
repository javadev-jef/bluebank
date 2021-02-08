package br.com.bluebank.domain.Blacklist;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported = false)
public interface BlacklistRepository extends CrudRepository<Blacklist, String>
{
    @Transactional
    public List<Blacklist> deleteByExpLessThanEqual(LocalDateTime dateNow);
}