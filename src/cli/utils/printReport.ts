import {exec} from 'child_process';
import * as os from 'os';
import {promisify} from 'util';
import {blankLn} from './log';

const execAsync = promisify(exec);

/**
 * Prints system information
 */
export const printReport = async (version: string): Promise<void> => {
    const {stdout: nodeVersion} = await execAsync('node -v');
    const {stdout: npmVersion} = await execAsync('npm -v');
    blankLn(`Li18nt: v${version}`);
    blankLn(`Node: ${nodeVersion.trim()}`);
    blankLn(`NPM: v${npmVersion.trim()}`);
    blankLn(`OS: ${os.arch()} ${os.version()} (v${os.release()}, ${os.platform()})`);
};
