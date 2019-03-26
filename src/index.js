import { render } from 'melody-component';
import movieList from './movie-list'

const documentRoot = document.getElementById('root');
render(documentRoot, movieList);