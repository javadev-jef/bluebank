package br.com.bluebank.domain.Blacklist;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistRepository extends CrudRepository<Blacklist, String>
{
    @Transactional
    public List<Blacklist> deleteByExpLessThanEqual(LocalDateTime dateNow);
}