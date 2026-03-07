import { LayoutDashboard, Users, Activity, Briefcase } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "ยอดเข้าชม", value: "2,405", icon: Users },
    { title: "ผลงานทั้งหมด", value: "12", icon: Briefcase },
    { title: "ทักษะทั้งหมด", value: "18", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LayoutDashboard className="text-gray-600" size={24} />
          ภาพรวมระบบ
        </h1>
        <p className="text-gray-500 mt-1">ยินดีต้อนรับเข้าสู่ระบบจัดการพอร์ตโฟลิโอของคุณ</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center gap-4"
            >
              <div className="p-3 rounded-md bg-gray-100 text-gray-600">
                <Icon size={24} />
              </div>
              <div className="flex-col flex">
                <span className="text-gray-500 text-sm font-medium">{stat.title}</span>
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-lg bg-gray-50 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">สถานะระบบ</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            เซิร์ฟเวอร์ทำงานปกติ
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            อัปเดตระบบล่าสุด: 1 ชั่วโมงที่แล้ว
          </div>
        </div>
      </div>
    </div>
  );
}
