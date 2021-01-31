/* eslint-disable react/prop-types */
import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';
import AlternativasDoForm from '../src/components/AlternativasdoForm';

function ResultWidget({resultado}) {
  return (
    <Widget>
      <Widget.Header>
        Tela de Resultado
      </Widget.Header>

      <Widget.Content>
      <p>Você acertou {resultado.reduce((somaAtual, resultadoAtual) =>{
        const acerto = resultadoAtual === true;
        {acerto ? somaAtual++ : somaAtual  };
        return somaAtual;
      }, 0)} questões, parabéns!</p>
      <ul>
        {resultado.map((result, index) => (
          <li>Questão {index+1}: {result === true ? 'Acertou': 'Errou'}</li>
        ))}
      </ul>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}


function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResultado,
}) {
  const [alternativaSelecionada, setAlternativaSelecionada] = React.useState(undefined);
  const[questaoPreenchida, setQuestaoPreenchida] = React.useState(false);
  const respostaCorreta = alternativaSelecionada === question.answer;
  const temAlternativaSelecionada = alternativaSelecionada !== undefined;
  const questionId = `question__${questionIndex}`;
  return (
    <Widget>
      <Widget.Header>
        {/* <BackLinkArrow href="/" /> */}
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativasDoForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setQuestaoPreenchida(true);
            setTimeout(() =>{
              addResultado(respostaCorreta);
              onSubmit();
              setQuestaoPreenchida(false);
              setAlternativaSelecionada(undefined);
            }, 2 * 1000)
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const respostaDeAlternativa = respostaCorreta ? 'SUCCESS' : 'ERROR';
            const statusDeAlternativaSelecionada = alternativaSelecionada === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={statusDeAlternativaSelecionada}
                data-status={questaoPreenchida && respostaDeAlternativa}
              >
                <input
                  // style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() =>{
                    setAlternativaSelecionada(alternativeIndex)
                  }}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}
          <Button type="submit" disabled={!temAlternativaSelecionada}>
            Confirmar
          </Button>
          {questaoPreenchida && respostaCorreta && <p>Você acertou!!</p>}
          {questaoPreenchida && !respostaCorreta && <p>Você errou!!</p>}
        </AlternativasDoForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};
export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const[resultado, setResultado] = React.useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  function addResultado(result){
    setResultado([
      ...resultado,
      result,
    ])
  }

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount
  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  // nasce === didMount
  }, []);
  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResultado={addResultado}
          />
        )}
        {screenState === screenStates.LOADING && <LoadingWidget />}
        {screenState === screenStates.RESULT && <ResultWidget resultado={resultado}/>}
      </QuizContainer>
    </QuizBackground>
  );
}