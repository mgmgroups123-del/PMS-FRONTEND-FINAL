import HttpClient from './httpClient';
import { HTTP_END_POINTS } from './httpEndpoints';

class Client {
	auth = {
		register: (data: any) =>
			HttpClient.post(HTTP_END_POINTS.auth.register, data),
		update_password: (data: any) =>
			HttpClient.update(HTTP_END_POINTS.auth.updatePassword, data),
		login: (data: any) => HttpClient.post(HTTP_END_POINTS.auth.login, data),
		me: () => HttpClient.get(HTTP_END_POINTS.auth.getProfile),
		update_profile: (data: any) =>
			HttpClient.update(HTTP_END_POINTS.auth.updateProfile, data),
		activity:(data:any)=>HttpClient.get(HTTP_END_POINTS.auth.activity,data),
    };
	dashboard={
		get:(data:any)=>HttpClient.get(HTTP_END_POINTS.DashBoard.get,data),
		getOccReport:(data:any)=>HttpClient.get(HTTP_END_POINTS.DashBoard.getocc,data),
		getGlobal:(data:any)=>HttpClient.get(HTTP_END_POINTS.DashBoard.global,data),
	}
	property = {
		getAll: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.property.getAll, params),
		create: (params: string) =>
			HttpClient.post(HTTP_END_POINTS.property.create, params),
		edit: (params: any, data: any) =>
			HttpClient.update(HTTP_END_POINTS.property.update + params.uuid, data),
		delete: (params: any) =>
			HttpClient.delete(HTTP_END_POINTS.property.delete + params.uuid),
		getByid: (params: any) =>
			HttpClient.get(HTTP_END_POINTS.property.get + params.uuid),
		getProperty: (data: any) =>
			HttpClient.get(HTTP_END_POINTS.property.getProperty, data),
	};
	land = {
		getAll: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.land.getAll, params),
		create: (params: any) =>
			HttpClient.post(HTTP_END_POINTS.land.create, params),
		edit: (data: any, params: string) =>
			HttpClient.update(
				HTTP_END_POINTS.land.update.replace(':uuid', params),
				data
			),
		delete: (params: string) =>
			HttpClient.delete(HTTP_END_POINTS.land.delete.replace(':uuid', params)),
		getByid: (params: {uuid: string}) =>
			HttpClient.get(HTTP_END_POINTS.land.get+params.uuid),
	};
	tenant = {
		getAll: (data: string) =>
			HttpClient.get(HTTP_END_POINTS.tenant.getAll, data),
		create: (params: string) =>
			HttpClient.post(HTTP_END_POINTS.tenant.create, params),
		edit: (data: any) =>
			HttpClient.update(
				HTTP_END_POINTS.tenant.update.replace(':uuid', data?.uuid),
				data?.data
			),
		delete: (params: any) =>
			HttpClient.delete(
				HTTP_END_POINTS.tenant.delete.replace(':uuid', params.uuid)
			),
		getByid: (params: any) =>
			HttpClient.get(
				HTTP_END_POINTS.tenant.get.replace(':uuid', params.uuid),
				params
			),
	};
	unit = {
		getAll: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.unit.getAll, params),
		create: (params: string) =>
			HttpClient.post(HTTP_END_POINTS.unit.create, params),
		getByid: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.unit.get, params),
		getbypropertyid: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.unit.getbyId + params),
		update: (params: string, data: any) =>
			HttpClient.update(HTTP_END_POINTS.unit.update + params, data),
	};
	rent = {
		getAll: (params: any) =>
			HttpClient.get(HTTP_END_POINTS.rent.getAll, params),
		getByid: (params: string) => HttpClient.get(HTTP_END_POINTS.rent.get, params),
		update: (params: any) => HttpClient.update(HTTP_END_POINTS.rent.update+ params.uuid, params),
		download: (uuid: string) => HttpClient.fileGet(HTTP_END_POINTS.rent.download+ uuid),
		delete: (params: string) => HttpClient.delete(HTTP_END_POINTS.rent.delete+ params),
		downloadExcel: () => HttpClient.fileGet(HTTP_END_POINTS.rent.downloadExcel),
		downloadPdf: (params:any) => HttpClient.fileGet(HTTP_END_POINTS.rent.downloadPdf, params),
    };
    lease = {
        getAll: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.lease.getAll, params),
		getByid: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.lease.get, params),
	};

	maintenance = {
		getAll: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.maintenance.getAll, params),
		create: (params: string) =>
			HttpClient.post(HTTP_END_POINTS.maintenance.create, params),
		edit: (data: any, params: string) =>
			HttpClient.update(HTTP_END_POINTS.maintenance.update, params, data),
		delete: (params: string) =>
			HttpClient.delete(HTTP_END_POINTS.maintenance.delete, params),
		getByid: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.maintenance.get, params),
	};

	notification = {
		getAll: (params: string) =>
			HttpClient.get(HTTP_END_POINTS.Notification.getAll, params),
		delete: (params: any) =>
			HttpClient.delete(HTTP_END_POINTS.Notification.delete + params?.uuid),
		updatestatus: (params: any) =>
			HttpClient.update(
				HTTP_END_POINTS.Notification.update + params?.uuid,
				params
			),
		updateAllstatus: () =>
			HttpClient.update(HTTP_END_POINTS.Notification.updateAll),
	};
}

export default new Client();
