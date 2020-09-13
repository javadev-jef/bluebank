package br.com.bluebank.application.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import br.com.bluebank.domain.Movement.Movement;
import br.com.bluebank.domain.Movement.MovementRepository;

@Component
@EnableScheduling
public class ScheduledTasks 
{
    @Autowired
    private MovementRepository movementRepository;

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);

    @Scheduled(cron = "0 00 00 * * *")
    public void checkAndPersistSchedules()
    {
        List<Movement> mvts = movementRepository.findAllScheduledByDate(LocalDate.now().plusDays(1));

        for(Movement mvt : mvts)
        {
            mvt.setScheduled(false);
            mvt.setDate(LocalDateTime.now());
            movementRepository.save(mvt);
        }
        logger.info("Foi encontrado "+mvts.size()+" agendamentos");

        // Delete failed movement scheduled
        mvts = movementRepository.findAllFailedMovementScheduledByDate(LocalDate.now());
        mvts.stream().forEach(mvt -> movementRepository.delete(mvt));
      
        logger.info("Foi encontrado "+mvts.size()+" com agendamentos failed");
    } 
}
