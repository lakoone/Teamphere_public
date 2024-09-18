import * as process from 'process';

export function writeLog(
  colorBgFunction: (text: string) => string,
  colorTextFunction: (text: string) => string,
  message: string,
  ...rest: any[]
) {
  const error = new Error();

  const stack = error.stack?.split('\n') || [];

  if (stack.length >= 3) {
    const callerLine = stack[2];
    const functionNameMatch = callerLine.match(
      /at ([\w.]+) \((.*):(\d+):(\d+)\)/,
    );
    if (functionNameMatch) {
      const functionName = functionNameMatch[1];
      const lineNumber = functionNameMatch[3];

      console.log(
        colorBgFunction(
          `PID: ${process.pid} ${functionName} - ${lineNumber} `,
        ) + colorTextFunction(` ${message} `),
        rest.length ? rest : '',
      );
    }
  } else {
    const logMessage = `${colorBgFunction('[Unknown file - Unknown function]')} ${message}`;
    console.log(logMessage);
  }
}
