import {ProcessImpl} from '../../src/process/ProcessImpl';
import {suite} from './index';

describe('ProcessImpl', function() {
  suite((name, tasks) => new ProcessImpl(name, tasks));
});
