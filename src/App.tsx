import './App.css';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MemoryRouter as Router, Route, Routes} from 'react-router-dom';
import {ChatPage} from '@/pages/Chat';
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
// import 'highlight.js/styles/github-dark-dimmed.css';
import 'katex/dist/katex.min.css'
import {io_ui, io_ui as io} from 'kiss-msg';
import { event as e } from './event'
import {useLocalStorage} from '@/hooks/useLocalStorage';
import {changeLicenceKey} from '@/ui.state';
import {useQueryUserInfo} from '@/hooks/useQueryUserInfo';
import {ref} from '@vue/reactivity';

const queryClient = new QueryClient();

function App() {
    const {getItem,setItem} = useLocalStorage()
    useEffect(() => {
        getItem("license").then((license) => {
            // console.log(license);
            changeLicenceKey(license)
        }).catch(() => {})
    }, []);

    return (
        <>
            <QueryClientProvider client={ queryClient }>
                <Router>
                    <main>
                        <Routes>
                            <Route path="" element={ <ChatPage/> }/>
                        </Routes>
                    </main>
                </Router>
            </QueryClientProvider>
        </>
    );
}

export default App;
