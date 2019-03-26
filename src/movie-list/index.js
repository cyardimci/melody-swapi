import { createComponent, RECEIVE_PROPS } from 'melody-component';
import { lifecycle } from 'melody-hoc';
import axios from 'axios';
import template from './index.twig';

const initialState = { films: {count: 0, list: []}, loading: false, error: '' };

const FETCH_FILMS = "FETCH_FILMS";
const UPDATE_LOADER = "UPDATE_LOADER";
const UPDATE_ERROR = "UPDATE_ERROR";

const updateLoader = () => ({type: UPDATE_LOADER})
const fetchFilms = (payload) => ({type: FETCH_FILMS, payload})
const updateError = (payload => ({type: UPDATE_ERROR, payload}))

const stateReducer = (state = initialState, action) => {
    switch(action.type) {
        case RECEIVE_PROPS:
            return {
                ...state,
                ...action.payload
            };
        case FETCH_FILMS:
            return {
                ...state,
                films: {
                    ...state.films,
                    count: action.payload.count,
                    list: [...action.payload.results]
                }

            };
        case UPDATE_LOADER:
            return {
                ...state,
                loading: !state.loading
            };
        case UPDATE_ERROR:
            return {
                ...state,
                error: action.payload.error
            };
    }
    return state;
}

const enhance = lifecycle({
    async componentWillMount() {
        this.dispatch(updateLoader())
        try {
            const res = await axios.get('https://swapi.co/api/films/')
            this.dispatch(updateLoader())
            this.dispatch(fetchFilms(res.data))
        } catch(e) {
            console.log(e)
            this.dispatch(updateError({error: 'There is an error'}))
        }
    }
});


export default enhance(createComponent(template, stateReducer));