
import { User, Category, QuizQuestion, AcademyItem, Branch } from './types';

export const INITIAL_BRANCHES: Branch[] = [
  { id: 'b1', name: 'Центральный (Aport)', city: 'Алматы', createdAt: Date.now() },
  { id: 'b2', name: 'MEGA Silk Way', city: 'Астана', createdAt: Date.now() },
  { id: 'b3', name: 'Dostyk Plaza', city: 'Алматы', createdAt: Date.now() }
];

export const INITIAL_USERS: Record<string, {password: string, user: User}> = {
  'master': {
    password: '123',
    user: { 
      id: '1', 
      username: 'master', 
      name: 'Главный Мастер', 
      role: 'ADMIN', 
      joinedAt: Date.now(),
      stats: { completedChecks: 250, passedExams: 12, xp: 45000, level: 80, rank: 'Legendary Master' }
    }
  },
  'head_user': {
    password: '123',
    user: { 
      id: '2', 
      username: 'head_user', 
      name: 'Александр К.', 
      role: 'HEAD', 
      branchId: 'b1',
      joinedAt: Date.now() - 10000000,
      stats: { completedChecks: 45, passedExams: 8, xp: 15200, level: 25, rank: 'Эксперт' }
    }
  },
  'manager_user': {
    password: '123',
    user: { 
      id: '3', 
      username: 'manager_user', 
      name: 'Дмитрий В.', 
      role: 'MANAGER', 
      branchId: 'b1',
      joinedAt: Date.now() - 5000000,
      stats: { completedChecks: 120, passedExams: 5, xp: 18000, level: 32, rank: 'Специалист' }
    }
  },
  'intern_user': {
    password: '123',
    user: { 
      id: '4', 
      username: 'intern_user', 
      name: 'Аружан С.', 
      role: 'INTERN', 
      branchId: 'b1',
      joinedAt: Date.now(),
      stats: { completedChecks: 2, passedExams: 0, xp: 500, level: 2, rank: 'Стажер' }
    }
  },
  'almaty_top': {
    password: '123',
    user: { 
      id: '6', 
      username: 'almaty_top', 
      name: 'Николай Г.', 
      role: 'MANAGER', 
      branchId: 'b3',
      joinedAt: Date.now(),
      stats: { completedChecks: 95, passedExams: 6, xp: 16000, level: 28, rank: 'Специалист' }
    }
  },
  'astana_top': {
    password: '123',
    user: { 
      id: '5', 
      username: 'astana_top', 
      name: 'Бауржан М.', 
      role: 'MANAGER', 
      branchId: 'b2',
      joinedAt: Date.now(),
      stats: { completedChecks: 80, passedExams: 4, xp: 12000, level: 20, rank: 'Специалист' }
    }
  }
};

export const BLACKLIST_PHONES = ['77771112233', '7071234567'];

export const CHECKLIST_SCHEMAS: Record<Category, string[]> = {
  'Смартфон': ['Экран/Выгорание', 'FaceID/TouchID', 'АКБ (%)', 'Корпус/Вмятины', 'Камеры', 'TrueTone', 'iCloud/Google'],
  'Ноутбук': ['Матрица', 'Клавиатура', 'Петли', 'Порты/Зарядка', 'SSD Health', 'iCloud/BIOS Lock'],
  'AirPods': ['Звук/Хрипы', 'Микрофоны', 'Кейс (зарядка)', 'Серийник/3uTools', 'Сетки'],
  'Часы': ['Сенсор/Колесо', 'Ремешок', 'Пульс/ЭКГ', 'Отвязка ID']
};

export const ACADEMY_DATA: Record<string, any> = {
  'home': {
    id: 'home',
    name: 'Home',
    grid: [
      { id: 'apple', name: 'iPhone Expert', icon: 'fa-brands fa-apple', meta: '15 уроков • +500 XP', difficulty: 'Middle' },
      { id: 'android', name: 'Samsung Master', icon: 'fa-brands fa-android', meta: '10 уроков • +300 XP', difficulty: 'Easy' },
      { id: 'laptops', name: 'Mac/Win Tech', icon: 'fa-solid fa-laptop', meta: '8 уроков • +450 XP', difficulty: 'Hard' },
      { id: 'audio', name: 'Audio Diagnostics', icon: 'fa-solid fa-headphones', meta: '5 уроков • +200 XP', difficulty: 'Easy' },
      { id: 'watches', name: 'Watch OS Check', icon: 'fa-solid fa-stopwatch', meta: '6 уроков • +250 XP', difficulty: 'Middle' },
      { id: 'security', name: 'Безопасность', icon: 'fa-solid fa-shield-halved', meta: '4 урока • +1000 XP', difficulty: 'Legendary' }
    ]
  },
  'apple': {
    id: 'apple',
    name: 'Apple',
    title: 'iPhone Expert: Полный регламент',
    content: `
      <div class="space-y-8 animate-in">
        <div class="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl">
          <h3 class="text-3xl font-black uppercase tracking-tighter mb-4">iPhone Protocol</h3>
          <p class="text-white/80 text-sm leading-relaxed">Самый важный раздел. Ошибки здесь стоят компании реальных денег.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="glass-card p-6 border-l-4 border-blue-500 bg-white">
            <h4 class="font-black text-xs uppercase text-blue-600 mb-2">IMEI CHECK</h4>
            <p class="text-xs text-gray-500">LL/A - США, KZ/A - Казахстан. Сверяй регион и блокировки SIM.</p>
          </div>
          <div class="glass-card p-6 border-l-4 border-emerald-500 bg-white">
            <h4 class="font-black text-xs uppercase text-emerald-600 mb-2">Герметичность</h4>
            <p class="text-xs text-gray-500">Метод продувки через SIM лоток — если воздух идет свободно, телефон вскрывался.</p>
          </div>
        </div>
      </div>
    `
  },
  'android': {
    id: 'android',
    name: 'Android',
    title: 'Samsung & Android Master',
    content: `
      <div class="space-y-8 animate-in">
        <div class="p-8 bg-emerald-600 rounded-[2.5rem] text-white shadow-2xl">
          <h3 class="text-3xl font-black uppercase tracking-tighter mb-4">Android Diagnostics</h3>
          <p class="text-white/80 text-sm">Выгорание OLED и FRP Lock — два главных врага при приеме.</p>
        </div>
        <div class="p-8 bg-white glass-card">
          <h4 class="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Код Инженерки</h4>
          <div class="p-6 bg-gray-50 rounded-2xl flex items-center gap-6">
            <code class="text-3xl font-black text-emerald-600">*#0*#</code>
            <p class="text-xs text-gray-500">Проверяй цветопередачу на наличие "фантомов" от TikTok или Instagram.</p>
          </div>
        </div>
      </div>
    `
  },
  'laptops': {
    id: 'laptops',
    name: 'Laptops',
    title: 'MacBook & Windows: Железо',
    content: `
      <div class="space-y-8 animate-in">
        <div class="p-8 bg-slate-900 rounded-[2.5rem] text-white">
          <h3 class="text-3xl font-black uppercase tracking-tighter mb-4">Laptop Diagnostic</h3>
          <p class="text-white/60 text-sm leading-relaxed">Проверка батареи и MDM профилей на Mac.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="glass-card p-6 bg-white border-l-4 border-slate-500">
            <h4 class="font-black text-xs uppercase text-slate-600 mb-2">Battery Health</h4>
            <p class="text-xs text-gray-500">Свыше 1000 циклов на Intel Mac — батарея под замену. Свыше 500 на M1/M2 — критично.</p>
          </div>
          <div class="glass-card p-6 bg-white border-l-4 border-blue-500">
            <h4 class="font-black text-xs uppercase text-blue-600 mb-2">MDM / iCloud</h4>
            <p class="text-xs text-gray-400">Обязательный сброс до приветствия. MDM (корпоративный блок) — не брать!</p>
          </div>
        </div>
      </div>
    `
  },
  'audio': {
    id: 'audio',
    name: 'Audio',
    title: 'AirPods: Оригинал или Копия?',
    content: `
      <div class="space-y-6 animate-in">
        <div class="p-8 bg-gray-100 rounded-[2.5rem] text-gray-900 border border-gray-200">
          <h3 class="text-3xl font-black uppercase tracking-tighter mb-4">Audio Quality</h3>
          <p class="text-gray-500 text-sm">3uTools не всегда видит копии. Слушай звук и смотри сетки.</p>
        </div>
        <div class="p-6 glass-card bg-white">
          <h4 class="font-black text-xs uppercase mb-2">Сетки динамиков</h4>
          <p class="text-xs text-gray-400">У оригинала сетка из металла, ровная. У копий — черная ткань или пластик.</p>
        </div>
      </div>
    `
  },
  'watches': {
    id: 'watches',
    name: 'Watches',
    title: 'Apple Watch: Тройной контроль',
    content: `
      <div class="space-y-6 animate-in text-center p-12 bg-white glass-card">
        <i class="fa fa-clock text-blue-600 text-5xl mb-6"></i>
        <h3 class="font-black uppercase text-xl">Протокол Watch</h3>
        <p class="text-xs text-gray-400 leading-relaxed mt-4">Обязательная привязка к своему iPhone после сброса клиентом. Если просит код — часы краденые.</p>
      </div>
    `
  },
  'security': {
    id: 'security',
    name: 'Security',
    title: 'Безопасность и Риски',
    content: `
      <div class="space-y-8 animate-in">
        <div class="p-10 bg-rose-600 rounded-[3rem] text-white shadow-2xl">
          <h3 class="text-4xl font-black uppercase tracking-tighter">STOP LIST</h3>
          <p class="text-white/80 mt-4 leading-relaxed">Никогда не бери устройство, если клиент торопит или не может выйти из аккаунта при тебе.</p>
        </div>
      </div>
    `
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { q: "Как зайти в тест Samsung?", a: "*#0*#", o: ["*#06#", "*#0*#", "*#8#"] }
];
