import { Customer, Roadmap, CustomerProgress } from '@/types';

const STORAGE_KEYS = {
  ROADMAPS: 'roadmap-navi:roadmaps',
  CUSTOMERS: 'roadmap-navi:customers',
  PROGRESS: 'roadmap-navi:progress',
} as const;

// ===================================
// ヘルパー関数
// ===================================

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value, (key, val) => {
      // Date型の復元
      if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
        return new Date(val);
      }
      return val;
    });
  } catch {
    return fallback;
  }
}

// ===================================
// ロードマップ管理
// ===================================

export function getAllRoadmaps(): Roadmap[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
  return parseJSON<Roadmap[]>(data, []);
}

export function saveRoadmap(roadmap: Roadmap): void {
  if (typeof window === 'undefined') return;
  const roadmaps = getAllRoadmaps();
  const index = roadmaps.findIndex((r) => r.id === roadmap.id);

  if (index >= 0) {
    roadmaps[index] = roadmap;
  } else {
    roadmaps.push(roadmap);
  }

  localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
}

export function getRoadmapById(id: string): Roadmap | null {
  const roadmaps = getAllRoadmaps();
  return roadmaps.find((r) => r.id === id) || null;
}

export function deleteRoadmap(id: string): void {
  if (typeof window === 'undefined') return;
  const roadmaps = getAllRoadmaps().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
}

// ===================================
// 顧客管理
// ===================================

export function getAllCustomers(): Customer[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  return parseJSON<Customer[]>(data, []);
}

export function saveCustomer(customer: Customer): void {
  if (typeof window === 'undefined') return;
  const customers = getAllCustomers();
  const index = customers.findIndex((c) => c.id === customer.id);

  if (index >= 0) {
    customers[index] = customer;
  } else {
    customers.push(customer);
  }

  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
}

export function getCustomerById(id: string): Customer | null {
  const customers = getAllCustomers();
  return customers.find((c) => c.id === id) || null;
}

export function deleteCustomer(id: string): void {
  if (typeof window === 'undefined') return;
  const customers = getAllCustomers().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));

  // 関連する進捗も削除
  const allProgress = getAllProgress();
  const filteredProgress = allProgress.filter((p) => p.customerId !== id);
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(filteredProgress));
}

// ===================================
// 進捗管理
// ===================================

export function getAllProgress(): CustomerProgress[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return parseJSON<CustomerProgress[]>(data, []);
}

export function getProgressByCustomerId(customerId: string): CustomerProgress[] {
  const allProgress = getAllProgress();
  return allProgress.filter((p) => p.customerId === customerId);
}

export function saveProgress(progressList: CustomerProgress[]): void {
  if (typeof window === 'undefined') return;
  const allProgress = getAllProgress();

  progressList.forEach((newProgress) => {
    const index = allProgress.findIndex((p) => p.id === newProgress.id);
    if (index >= 0) {
      allProgress[index] = newProgress;
    } else {
      allProgress.push(newProgress);
    }
  });

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

export function updateProgress(progress: CustomerProgress): void {
  if (typeof window === 'undefined') return;
  const allProgress = getAllProgress();
  const index = allProgress.findIndex((p) => p.id === progress.id);

  if (index >= 0) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }

  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}

// ===================================
// 初期データのセットアップ
// ===================================

export function initializeSampleData(): void {
  if (typeof window === 'undefined') return;

  // すでにデータがある場合はスキップ
  if (getAllRoadmaps().length > 0) return;

  // サンプルロードマップを作成
  const sampleRoadmap: Roadmap = {
    id: 'roadmap-1',
    name: '新規顧客フォロー',
    description: '新規顧客向けの標準フォロープラン',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: '新規登録',
        description: '顧客登録完了',
        baseType: 'registration',
        dayOffset: 0,
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: '製品到着確認',
        description: '製品が届いたか確認',
        baseType: 'registration',
        dayOffset: 2,
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'セミナー案内',
        description: 'オンラインセミナーの案内',
        baseType: 'registration',
        dayOffset: 5,
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: '製品感想確認',
        description: '実際に使ってみた感想を聞く',
        baseType: 'previous_completion',
        dayOffset: 3,
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: 'イベント案内',
        description: '次回イベントの案内',
        baseType: 'registration',
        dayOffset: 14,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  saveRoadmap(sampleRoadmap);
}
