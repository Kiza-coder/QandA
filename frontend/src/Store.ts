import {
    QuestionsData,
    getUnansweredQuestions,
    getQuestion,
    postQuestion,
    PostQuestionData,
    postAnswer,
    AnswerData,
    PostAnswerData,
    searchQuestions,
  } from './QuestionsData';

import { Action, ActionCreator, Dispatch, Reducer,combineReducers, Store,createStore,applyMiddleware } from 'redux'
import thunk,{ ThunkAction } from 'redux-thunk';


const initialQuestionState: QuestionsState = {
    loading: false,
    unanswered: null,
    viewing: null,
    searched: null
    };

interface QuestionsState {
    readonly loading: boolean;
    readonly unanswered: QuestionsData[] | null;
    readonly viewing: QuestionsData | null
    readonly searched: QuestionsData[] | null
    readonly postedResult?: QuestionsData;
    readonly postedAnswerResult?: AnswerData
    }

    export interface AppState {
    readonly questions: QuestionsState;
    }

interface GettingUnansweredQuestionsAction extends Action<'GettingUnansweredQuestions'> {}

export interface GotUnansweredQuestionsAction
extends Action<'GotUnansweredQuestions'> {
questions: QuestionsData[];
}

export interface PostedQuestionAction extends
Action<'PostedQuestion'> {
result: QuestionsData | undefined;
}

interface SearchingQuestionsAction extends Action<'SearchingQuestions'> {}
export interface SearchedQuestionsAction extends Action<'SearchedQuestions'> {
    questions: QuestionsData[];
  }

  export interface PostedAnswerAction extends Action<'PostedAnswer'> {
    questionId: number;
    result: AnswerData | undefined;
  }
  export interface GotQuestionAction extends Action<'GotQuestion'> {
    question: QuestionsData | null;
  }
  interface GettingQuestionAction extends Action<'GettingQuestion'> {}
  

type QuestionsActions =
| GettingUnansweredQuestionsAction
  | GotUnansweredQuestionsAction
  | GettingQuestionAction
  | GotQuestionAction
  | SearchingQuestionsAction
  | SearchedQuestionsAction
  | PostedQuestionAction
  | PostedAnswerAction



//////
export const getUnansweredQuestionsActionCreator:ActionCreator<
ThunkAction<Promise<void>,QuestionsData[],null,GotUnansweredQuestionsAction>> = () => {
    return async (dispatch: Dispatch) => {
        const gettingUnansweredQuestionsAction:
        GettingUnansweredQuestionsAction = {
        type: 'GettingUnansweredQuestions'
        };
        dispatch(gettingUnansweredQuestionsAction);
        const questions = await getUnansweredQuestions();
        const gotUnansweredQuestionAction: GotUnansweredQuestionsAction
        = {
        questions,
        type: 'GotUnansweredQuestions'
        };
        dispatch(gotUnansweredQuestionAction);
    };
};
    ///
export const postQuestionActionCreator: ActionCreator<
ThunkAction<Promise<void>,QuestionsData,PostQuestionData,PostedQuestionAction>> = (question: PostQuestionData) => {
    return async (dispatch: Dispatch) => {
    const result = await postQuestion(question);
    const postedQuestionAction: PostedQuestionAction = {
        type: 'PostedQuestion',
        result
        };
    dispatch(postedQuestionAction);
    };
};

export const searchQuestionsActionCreator: ActionCreator<
  ThunkAction<Promise<void>, QuestionsData[], null, SearchedQuestionsAction>
> = (criteria: string) => {
  return async (dispatch: Dispatch) => {
    const searchingQuestionsAction: SearchingQuestionsAction = {
      type: 'SearchingQuestions',
    };
    dispatch(searchingQuestionsAction);
    const questions = await searchQuestions(criteria);
    const searchedQuestionAction: SearchedQuestionsAction = {
      questions,
      type: 'SearchedQuestions',
    };
    dispatch(searchedQuestionAction);
  };
};

export const postAnswerActionCreator: ActionCreator<
  ThunkAction<Promise<void>, AnswerData, PostAnswerData, PostedAnswerAction>
> = (answer: PostAnswerData) => {
  return async (dispatch: Dispatch) => {
    const result = await postAnswer(answer);
    const postedAnswerAction: PostedAnswerAction = {
      type: 'PostedAnswer',
      questionId: answer.questionId,
      result,
    };
    dispatch(postedAnswerAction);
  };
};


export const clearPostedQuestionActionCreator: ActionCreator<
PostedQuestionAction> = () => {
    const postedQuestionAction: PostedQuestionAction = {
    type: 'PostedQuestion',
    result: undefined,
    };
    return postedQuestionAction;
};

export const clearPostedAnswerActionCreator: ActionCreator<
  PostedAnswerAction
> = () => {
  const postedAnswerAction: PostedAnswerAction = {
    type: 'PostedAnswer',
    questionId: 0,
    result: undefined,
  };
  return postedAnswerAction;
};




const questionsReducer: Reducer<QuestionsState, QuestionsActions> =
(
state = initialQuestionState,
action
) => {
    switch (action.type) {
        case 'GettingUnansweredQuestions': {
            return {
              ...state,
              unanswered: null,
              loading: true,
            };
          }
          case 'GotUnansweredQuestions': {
            return {
              ...state,
              unanswered: action.questions,
              loading: false,
            };
          }
          case 'GettingQuestion': {
            return {
              ...state,
              viewing: null,
              loading: true,
            };
          }
          case 'GotQuestion': {
            return {
              ...state,
              viewing: action.question,
              loading: false,
            };
          }
          case 'SearchingQuestions': {
            return {
              ...state,
              searched: null,
              loading: true,
            };
          }
          case 'SearchedQuestions': {
            return {
              ...state,
              searched: action.questions,
              loading: false,
            };
          }
          case 'PostedQuestion': {
            return {
              ...state,
              unanswered: action.result
                ? (state.unanswered || []).concat(action.result)
                : state.unanswered,
              postedResult: action.result,
            };
          }
          case 'PostedAnswer': {
            return {
              ...state,
              unanswered: action.result
                ? (state.unanswered || []).filter(
                    q => q.questionId !== action.questionId,
                  )
                : state.unanswered,
              postedAnswerResult: action.result,
            };
          }
        default:
            neverReached(action)
        }
        return state;
};

const neverReached = (never:never) => {};


const rootReducer = combineReducers<AppState>({
    questions: questionsReducer
});

export function configureStore(): Store<AppState> {
    const store = createStore(
        rootReducer,
        undefined,
        applyMiddleware(thunk)
        );
    return store;
}

