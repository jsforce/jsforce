import { EventEmitter } from 'events';
import { SfdxRegistry } from '../src/registry/sfdx';

const mockSpawn = jest.fn();

jest.mock('cross-spawn', () => ({
  __esModule: true,
  default: (...args: any[]) => mockSpawn(...args),
}));

function fakeProc(stdout: string, exitCode = 0) {
  const proc = new EventEmitter();
  const stdoutEmitter = new EventEmitter();
  (proc as any).stdout = stdoutEmitter;
  process.nextTick(() => {
    stdoutEmitter.emit('data', Buffer.from(stdout));
    proc.emit('close', exitCode);
  });
  return proc;
}

describe('SfdxRegistry', () => {
  afterEach(() => {
    mockSpawn.mockReset();
  });

  describe('_execCommand', () => {
    it('should call cross-spawn with the correct exe and argv', async () => {
      const output = JSON.stringify({ status: 0, result: { username: 'test' } });
      mockSpawn.mockReturnValue(fakeProc(output));

      const registry = new SfdxRegistry({});
      const result = await registry._execCommand('force:org:display', {
        u: 'test',
      });

      expect(mockSpawn).toHaveBeenCalledTimes(1);
      const [exe, argv] = mockSpawn.mock.calls[0];
      expect(exe).toBe('sfdx');
      expect(argv).toEqual(['force:org:display', '-u', 'test', '--json']);
      expect(result).toEqual({ username: 'test' });
    });

    it('should not pass shell metacharacters through a shell', async () => {
      const output = JSON.stringify({ status: 0, result: { ok: true } });
      mockSpawn.mockReturnValue(fakeProc(output));

      const registry = new SfdxRegistry({});
      await registry._execCommand('force:org:display', {
        u: '$(whoami); rm -rf /',
      });

      const [, argv] = mockSpawn.mock.calls[0];
      expect(argv[2]).toBe('$(whoami); rm -rf /');
    });
  });

  describe('_buildArgs', () => {
    it('should return executable and argument array instead of a shell string', () => {
      const registry = new SfdxRegistry({});
      const { exe, argv } = registry._buildArgs('force:org:display', {
        u: 'test@example.com',
      });
      expect(exe).toBe('sfdx');
      expect(argv).toEqual([
        'force:org:display',
        '-u',
        'test@example.com',
        '--json',
      ]);
    });

    it('should use cliPath when provided', () => {
      const registry = new SfdxRegistry({ cliPath: '/usr/local/bin' });
      const { exe, argv } = registry._buildArgs('force:org:list');
      expect(exe).toBe('/usr/local/bin/sfdx');
      expect(argv).toEqual(['force:org:list', '--json']);
    });

    it('should keep shell metacharacters as literal strings in the args array', () => {
      const registry = new SfdxRegistry({});
      const maliciousName = 'foo; rm -rf /';
      const { exe, argv } = registry._buildArgs('force:org:display', {
        u: maliciousName,
      });
      expect(exe).toBe('sfdx');
      // The malicious payload is preserved as a single array element,
      // not split by shell metacharacters — execFile passes it as one argv entry
      const uIndex = argv.indexOf('-u');
      expect(argv[uIndex + 1]).toBe(maliciousName);
      expect(argv).toHaveLength(4); // command, -u, value, --json
    });

    it('should not concatenate option values into a shell-interpreted string', () => {
      const registry = new SfdxRegistry({});
      const payload = '$(whoami)';
      const { argv } = registry._buildArgs('force:org:display', {
        u: payload,
      });
      const uIndex = argv.indexOf('-u');
      expect(argv[uIndex + 1]).toBe(payload);
    });

    it('should handle long option names with double dashes', () => {
      const registry = new SfdxRegistry({});
      const { argv } = registry._buildArgs('force:org:display', {
        targetusername: 'test@example.com',
      });
      expect(argv).toContain('--targetusername');
    });

    it('should handle boolean options (null value)', () => {
      const registry = new SfdxRegistry({});
      const { argv } = registry._buildArgs('force:org:list', {
        all: null,
      });
      expect(argv).toContain('--all');
      const allIndex = argv.indexOf('--all');
      expect(argv[allIndex + 1]).toBe('--json');
    });

    it('should pass additional args after --json', () => {
      const registry = new SfdxRegistry({});
      const { argv } = registry._buildArgs(
        'force:org:display',
        {},
        ['--verbose'],
      );
      const jsonIndex = argv.indexOf('--json');
      expect(argv[jsonIndex + 1]).toBe('--verbose');
    });
  });
});
