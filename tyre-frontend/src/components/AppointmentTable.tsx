import React from 'react';
import { Clock, MapPin, Car, Calendar } from 'lucide-react';

interface Appointment {
    id: number;
    servicePoint: string;
    service: string;
    vehicle: string;
    date: string;
    time: string;
    status: 'Beklemede' | 'Onaylandı' | 'Tamamlandı' | 'İptal Edildi';
    address: string;
}

const AppointmentTable: React.FC = () => {
    const appointments: Appointment[] = [
        {
            id: 1,
            servicePoint: 'Pitstop Kadıköy',
            service: 'Lastik Değişimi',
            vehicle: 'BMW 320i (34 ABC 123)',
            date: '2024-03-20',
            time: '14:30',
            status: 'Onaylandı',
            address: 'Kadıköy, İstanbul'
        },
        {
            id: 2,
            servicePoint: 'Pitstop Beşiktaş',
            service: 'Lastik Rotasyonu',
            vehicle: 'Mercedes C200 (34 XYZ 789)',
            date: '2024-03-22',
            time: '10:00',
            status: 'Beklemede',
            address: 'Beşiktaş, İstanbul'
        },
        {
            id: 3,
            servicePoint: 'Pitstop Ataşehir',
            service: 'Balans Ayarı',
            vehicle: 'Audi A4 (34 DEF 456)',
            date: '2024-03-25',
            time: '16:00',
            status: 'Beklemede',
            address: 'Ataşehir, İstanbul'
        }
    ];

    const getStatusColor = (status: Appointment['status']): string => {
        switch (status) {
            case 'Beklemede':
                return 'bg-yellow-900 text-yellow-300';
            case 'Onaylandı':
                return 'bg-blue-900 text-blue-300';
            case 'Tamamlandı':
                return 'bg-green-900 text-green-300';
            case 'İptal Edildi':
                return 'bg-red-900 text-red-300';
            default:
                return 'bg-gray-700 text-gray-300';
        }
    };

    const formatDate = (date: string): string => {
        return new Date(date).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Servis Noktası
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Hizmet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Araç
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Tarih & Saat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Durum
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-700 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-100">
                                            {appointment.servicePoint}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {appointment.address}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {appointment.service}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <Car className="h-4 w-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-300">{appointment.vehicle}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                    <div>
                                        <div className="text-sm text-gray-300">
                                            {formatDate(appointment.date)}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {appointment.time}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentTable; 