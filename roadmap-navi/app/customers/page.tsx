'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Customer, Roadmap } from '@/types';
import { getAllCustomers, getAllRoadmaps, deleteCustomer } from '@/lib/storage';
import { formatDate } from '@/lib/dateCalculator';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  const loadData = () => {
    setCustomers(getAllCustomers());
    setRoadmaps(getAllRoadmaps());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`${name}さんを削除しますか？`)) {
      deleteCustomer(id);
      loadData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">👥 顧客一覧</h1>
        <Link href="/customers/new">
          <Button variant="primary">+ 顧客を登録</Button>
        </Link>
      </div>

      {customers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">登録された顧客はいません。</p>
            <Link href="/customers/new">
              <Button variant="primary">最初の顧客を登録</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => {
            const roadmap = roadmaps.find((r) => r.id === customer.roadmapId);
            return (
              <Card key={customer.id}>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {customer.name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      登録日: {formatDate(customer.registeredAt)}
                    </p>
                    <p>
                      ロードマップ: {roadmap?.name || '不明'}
                    </p>
                    {customer.memo && (
                      <p className="text-gray-500 text-xs mt-2">
                        {customer.memo}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-3">
                    <Link href={`/customers/${customer.id}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        詳細
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(customer.id, customer.name)}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
