import { createComponent, RECEIVE_PROPS } from 'melody-component';
import { bindEvents } from 'melody-hoc';
import template from './index.twig';

const initialState = {showContent: false};

const HANDLE_CLICK = 'HANDLE_CLICK'

const handleOnClick = () => ({type: HANDLE_CLICK})

const stateReducer = (state = initialState, action) => {
    switch(action.type) {
        case RECEIVE_PROPS:
            return {
                ...state,
                ...action.payload
            };
        case HANDLE_CLICK:
            return {
                ...state,
                film: {...state.film},
                showContent: !state.showContent
            };
    }
    return state;
}

const withClickHandlers = bindEvents({
    listItem: {
        click(event, component) {
            component.dispatch(handleOnClick())
        }
    },
});


const component = createComponent(template, stateReducer);

export default withClickHandlers(component);