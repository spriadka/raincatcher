import {ProcessInstance} from '../process-instance/ProcessInstance';
import {Process} from '../process/Process';

/**
 * Executor engine for a {@link Process}
 *
 * Triggers instantiation and execution of a {@link ProcessInstance}
 */
export interface Executor {
  /**
   * {@link Process} to be executed
   */
  process: Process;
  /**
   * {@link ProcessInstance} that is created based on {@link Process}
   */
  instance?: ProcessInstance;

  /**
   * Starts the execution of the assigned Process
   */
  start(): void;
}
