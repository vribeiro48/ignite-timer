import { HandPalm, Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmount, Separator, StartCountdownButton, StopCountdownButton, TaskInput } from "./styles";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

        if (secondsDifference >= totalSeconds) {
          setCycles(state => state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date()}
              }
              else{
                return cycle
              }
            })
          )
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        }
        else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date()
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)

    reset();
  }

  function handleInterruptCycle() {
    setCycles(state =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date()}
        }
        else{
          return cycle
        }
      })
    )

    setActiveCycleId(null);
  }

  
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title= `${minutes}:${seconds}`
    }
    
  }, [minutes, seconds, activeCycle])


  const task = watch('task')

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            list="task-suggestions" 
            type="text" 
            placeholder="D?? um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Projeto 3"></option>
            <option value="Atum"></option>
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmount 
            id="minutesAmount" 
            type="number" 
            placeholder="00" 
            step={5} 
            min={5} 
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

      { activeCycle ? (
        <StopCountdownButton onClick={handleInterruptCycle} type="button">
          <HandPalm size={24} />
          Interromper
        </StopCountdownButton>
      ) : (
        <StartCountdownButton disabled={!task} type="submit">
          <Play size={24} />
          Come??ar
        </StartCountdownButton>
      ) }       

      </form>
    </HomeContainer>  
  )
}
