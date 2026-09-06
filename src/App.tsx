import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Overview from './pages/Overview';
import PointDetail from './pages/PointDetail';
import Quiz from './pages/Quiz';
import WrongBook from './pages/WrongBook';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="overview/:subjectId" element={<Overview />} />
        <Route path="point/:pointId" element={<PointDetail />} />
        <Route path="wrong" element={<WrongBook />} />
        <Route path="quiz/wrong" element={<Quiz />} />
        <Route path="quiz/point/:pointId" element={<Quiz />} />
        <Route path="quiz/:subjectId/chapter/:chapterId" element={<Quiz />} />
        <Route path="quiz/:subjectId/level/:level" element={<Quiz />} />
        <Route path="quiz/:subjectId/random" element={<Quiz />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
