/**
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define([],
    () => {

        class MathOperations {
            add(a, b) {
                return a + b;
            }

            subtract(a, b) {
                return a - b;
            }

            multiply(a, b) {
                return a * b;
            }

            divide(a, b) {
                if (b === 0) {
                    throw new Error('Division by zero is not allowed.');
                }
                return a / b;
            }
        }

        return new MathOperations();
    });
