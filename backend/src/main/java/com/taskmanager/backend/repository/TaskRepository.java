package com.taskmanager.backend.repository;

import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);
}
