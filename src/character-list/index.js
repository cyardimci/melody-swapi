import { createComponent, RECEIVE_PROPS } from 'melody-component'
import template from './index.twig'
import { lifecycle } from 'melody-hoc'
import axios from 'axios/index'

const initialState = { characterList: [], loading: false, error: '' }

const UPDATE_CHARACTER_LIST = 'UPDATE_CHARACTER_LIST'
const UPDATE_ERROR = 'UPDATE_ERROR'
const UPDATE_LOADER = 'UPDATE_LOADER'

const updateCharacterList = payload => ({
    type: UPDATE_CHARACTER_LIST,
    payload,
})
const updateLoader = () => ({ type: UPDATE_LOADER })
const updateError = payload => ({ type: UPDATE_ERROR, payload })

const stateReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_PROPS:
            return {
                ...state,
                ...action.payload,
            }
        case UPDATE_CHARACTER_LIST:
            return {
                ...state,
                characterList: [...action.payload],
            }
        case UPDATE_LOADER:
            return {
                ...state,
                loading: !state.loading,
            }
    }
    return state
}

const enhance = lifecycle({
    async componentDidMount() {
        const { characterListEndPoints } = this.props
        this.dispatch(updateLoader())
        try {
            const characterList = await Promise.all(
                characterListEndPoints.map(async c => {
                    const character = await axios.get(c)
                    return character && character.data
                })
            )
            this.dispatch(updateCharacterList(characterList))
            this.dispatch(updateLoader())
        } catch (e) {
            console.log(e)
            this.dispatch(updateError({ error: 'There is an error' }))
        }
    },
})

const component = createComponent(template, stateReducer)

export default enhance(component)
