import {Organizer} from './organizer';

export class Participant {
  id = 0;
  uuid = '';
  email = '';
  firstName = '';
  lastName = '';
  address = '';
  zipCode = '';
  city = '';
  country = '';
  drivingLicense = '';
  drivingLicenseDate = '';
  drivingLicenseCity = '';
  vehicle = '';
  vehicleRegistration = '';
  vehicleInsurance = '';
  vehicleInsuranceNumber = '';
  vehicleInsuranceDate = '';
  createdAt = '';
  updatedAt = '';
  organizer: Organizer = new Organizer();
  select = false;
  ready = false;
  fall = false;
  abandonAppealFile = '';
  urgenceCall = '';

  constructor(data: any = null) {
    if (data) {
      this.id = data.id;
      this.uuid = data.uuid;
      this.email = data.email;
      this.firstName = data.firstName.toUpperCase();
      this.lastName = data.lastName;
      this.address = data.address;
      this.zipCode = data.zipCode;
      this.city = data.city;
      this.ready = data.ready;
      this.fall = data.fall;
      this.country = data.country;
      this.urgenceCall = data.urgenceCall;
      this.abandonAppealFile = data.abandonAppealFile;
      this.drivingLicense = data.drivingLicense;
      this.drivingLicenseDate = data.drivingLicenseDate;
      this.drivingLicenseCity = data.drivingLicenseCity;
      this.vehicle = data.vehicle;
      this.vehicleRegistration = data.vehicleRegistration;
      this.vehicleInsurance = data.vehicleInsurance;
      this.vehicleInsuranceNumber = data.vehicleInsuranceNumber;
      this.vehicleInsuranceDate = data.vehicleInsuranceDate;
      if (data.organizer && data.organizer !== undefined) {
        this.organizer = new Organizer(data.organizer);
      }
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }
}
