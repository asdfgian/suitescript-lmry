/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NAmdConfig  ./config/configPaths.json
 */
define(['N/log', 'math'],
    (log, math) => {
        const execute = (scriptContext) => {
            const num1 = 10;
            const num2 = 5;

            //@ts-ignore
            const sum = math.add(num1, num2);
            log.debug('Suma', `La suma de ${num1} y ${num2} es ${sum}`);

            //@ts-ignore
            const quotient = math.divide(num1, num2);
            log.debug('División', `La división de ${num1} entre ${num2} es ${quotient}`);
        }
        return { execute }
    });
