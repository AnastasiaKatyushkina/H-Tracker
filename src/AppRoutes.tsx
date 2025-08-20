import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/loginPage';
import ToDoPage from './pages/toDoPage';
import HabitsPage from './pages/habitsPage';
import ProfilePage from './pages/profilePage';
import NewHabitPage from './pages/newHabitPage';
import HabitEditPage from './pages/habitEditPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<ToDoPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/habits' element={<HabitsPage />} />
      <Route path='/habits/new' element={<NewHabitPage />} />
      <Route path='/habits/edit/:id' element={<HabitEditPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  );
}
