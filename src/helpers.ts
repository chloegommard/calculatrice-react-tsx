import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { z } from 'zod'

export function somme(operand1: number, operand2: number): string {
  const result = operand1 + operand2
  return String(result)
}

export function sub(operand1: number, operand2: number): string {
  const result = operand1 - operand2
  return String(result)
}

export function times(operand1: number, operand2: number): string {
  const result = operand1 * operand2
  return String(result)
}

export function div(operand1: number, operand2: number): string {
  if (operand2 === 0) {
    throw new Error('impossible de div par 0')
  } else {
    const result = operand1 / operand2
    return String(result)
  }
}

export function solve(
  operation: string,
  dispatchSetStateAction: React.Dispatch<React.SetStateAction<string>>,
) {
  const formulaRegex: RegExp = /^(-?\d+(\.\d+)?)\s*([+*/-])\s*(-?\d+(\.\d+)?)$/g
  const operators: RegExp = /[+\-*/]/g
  const operationSchema: z.ZodString = z.string().min(3).regex(formulaRegex)

  try {
    operationSchema.parse(operation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error('Pas une formule arithmétique: ')
      return
    } else {
      console.error('Erreur inattendue :', error)
      return
    }
  }

  const operandSchema = z.coerce.number()
  const parts = operation.split(operators)
  const operands: number[] = parts.map(parts =>
    operandSchema.parse(parts.trim()),
  ) //conversion en nombre
  const [firstOperand, secondOperand]: number[] = operands
  const matches = operation.match(operators)

  let operator: RegExpMatchArray[number] | null = null
  if (matches !== null) {
    [operator] = matches
  }

  switch (operator) {
    case '+':
      dispatchSetStateAction(somme(firstOperand, secondOperand))
      break
    case '-':
      dispatchSetStateAction(sub(firstOperand, secondOperand))
      break
    case '*':
      dispatchSetStateAction(times(firstOperand, secondOperand))
      break
    case '/':
      dispatchSetStateAction(div(firstOperand, secondOperand))
      break
    default:
      console.log('Something unexpected happened')
      break
  }
}
