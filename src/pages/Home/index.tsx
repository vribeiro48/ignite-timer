import { Play } from "phosphor-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmount, Separator, StartCountdownButton, TaskInput } from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  MinutesAmount: zod.number().min(5).max(60)
})

export function Home() {
  const { register, handleSubmit, watch } = useForm({
    resolver: zodResolver(newCycleFormValidationSchema)
  })

  function handleCreateNewCycle(data:any) {
    console.log(data)
  }

  const task = watch('task')

  return (
    <HomeContainer>
      <form action="">
        <FormContainer onSubmit={handleSubmit(handleCreateNewCycle)}>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput 
            id="task" 
            list="task-suggestions" 
            type="text" 
            placeholder="Dê um nome para o seu projeto"
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
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

      <StartCountdownButton disabled={!task} type="submit">
        <Play size={24} />
        Começar
      </StartCountdownButton>

      </form>
    </HomeContainer>  
  )
}
