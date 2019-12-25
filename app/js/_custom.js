const buttonsCreateRecord = document.querySelectorAll('.create_record');
const buttonsSaveRecord = document.querySelectorAll('.save_record');
const buttonsDeleteFewRecords = document.querySelectorAll('.delete_few_records');

const bodyRecords = document.querySelectorAll('.records');

let idOfficeRecordToEdit = null;
let idStaffRecordToEdit = null;

const officeArray = [];
const staffArray = [];

document.addEventListener("DOMContentLoaded", function() {
	Array.prototype.forEach.call(buttonsCreateRecord, e => e.addEventListener('click', createRecord));
	Array.prototype.forEach.call(buttonsSaveRecord, e => e.addEventListener('click', saveRecord));
	Array.prototype.forEach.call(buttonsDeleteFewRecords, e => e.addEventListener('click', deleteFewRecords));

	Array.prototype.forEach.call(bodyRecords, e => e.addEventListener('click', delegationEditDelete));

	getOffices();
});

function formRecordValidation(form) {
	const officeName = document.getElementById('office_name').value;
	const staffName = document.getElementById('staff_name').value;
	const staffOfficeName = document.getElementById('staff_office_name').value;
	
	const result = (form === 'offices') 
					? {name: officeName} 
					: (form === 'staff') 
						? {name: staffName, staffOfficeName: staffOfficeName}
						: {};

	for(let value in result) {
		if (result[value] === '') {
			alert(`Fill in all the field of "${form}" form`);
			return 0;
		}
	}

	return result;
}

function createRecord(event) {
	event.preventDefault();
	const form = event.target.getAttribute('data-form');
				
	let values = formRecordValidation(form);
	if(!values) return 0;

	const {name, staffOfficeName} = values;
	
	const id = Date.now();
	
	createRecordHTML(form, id, name, staffOfficeName);
}

function createRecordHTML(form, id, name, staffOfficeName) {
	const time = new Date().toLocaleDateString();
	const field = document.querySelector(`.records[data-form='${form}']`);

	const row = document.createElement('tr');
	const rowAttributeId = document.createAttribute(`data-${form}-record-id`);
	const rowAttributeName = document.createAttribute(`data-${form}-record-name`);
	const rowAttributeChecked = document.createAttribute(`data-${form}-record-checked`);
	row.classList = `${form}-record`;
	row.id = `${form}-record-` + id;
	rowAttributeId.value = id;
	rowAttributeName.value = name;
	rowAttributeChecked.value = false;
	row.setAttributeNode(rowAttributeId);
	row.setAttributeNode(rowAttributeName);
	row.setAttributeNode(rowAttributeChecked);

	const fieldName = document.createElement('td');
	fieldName.innerHTML = name;

	const attributeDataFormEdit = document.createAttribute('data-form');
	attributeDataFormEdit.value = form;

	const fieldEdit = document.createElement('td');
	const buttonEdit = document.createElement('button');
	buttonEdit.classList = 'edit_record far fa-edit';
	buttonEdit.setAttributeNode(attributeDataFormEdit);
	fieldEdit.append(buttonEdit);

	const attributeDataFormDelete = document.createAttribute('data-form');
	attributeDataFormDelete.value = form;

	const fieldDelete = document.createElement('td');
	const buttonDelete = document.createElement('button');
	buttonDelete.classList = 'delete_record far fa-trash-alt';
	buttonDelete.setAttributeNode(attributeDataFormDelete);
	fieldDelete.append(buttonDelete); 

	if(form === 'offices') {
		if(officeArray.some(office => office.name === name)) {
			alert('Entered office already exist !');
			return 0;
		}

		field.append(row);
		row.append(fieldName);
		row.append(fieldEdit);
		row.append(fieldDelete);

		document.getElementById('office_name').value = '';

		officeArray.push({id: id, name: name});

	} else if (form === 'staff') {
		if(!officeArray.some(office => office.name === staffOfficeName)) {
			alert('Entered office does\'t exist !');
			return 0;
		}

		const rowAttributeStaffOfficeName = document.createAttribute(`data-${form}-record-office-name`);
		rowAttributeStaffOfficeName.value = staffOfficeName;
		row.setAttributeNode(rowAttributeStaffOfficeName);

		const fieldStaffOfficeName = document.createElement('td');
		fieldStaffOfficeName.innerHTML = staffOfficeName;
		row.append(fieldStaffOfficeName);

		const fieldTime = document.createElement('td');
		fieldTime.innerHTML = time;
		row.append(fieldTime);

		field.append(row);
		row.append(fieldName);
		row.append(fieldStaffOfficeName);
		row.append(fieldTime);
		row.append(fieldEdit);
		row.append(fieldDelete);

		document.getElementById('staff_name').value = '';
		document.getElementById('staff_office_name').value = '';

		staffArray.push({id: id, name: name, staffOfficeName: staffOfficeName});
	}
}

function editRecord(id, form) {
	if((form === 'offices') && idOfficeRecordToEdit) {
		const currentRecord = document.querySelector(`.${form}-record[data-${form}-record-id="${idOfficeRecordToEdit}"]`);
		currentRecord.querySelector('.edit_record').disabled = false;
		currentRecord.querySelector('.delete_record').disabled = false;
		idOfficeRecordToEdit = null;

	} else if((form === 'staff') && idStaffRecordToEdit) {
		const currentRecord = document.querySelector(`.${form}-record[data-${form}-record-id="${idStaffRecordToEdit}"]`);
		currentRecord.querySelector('.edit_record').disabled = false;
		currentRecord.querySelector('.delete_record').disabled = false;
		idStaffRecordToEdit = null;
	}

	const currentRecord = document.querySelector(`.${form}-record[data-${form}-record-id="${id}"]`);
	
	if(form === 'offices') {
		idOfficeRecordToEdit = id;

		document.getElementById('office_name').value = currentRecord.getAttribute(`data-${form}-record-name`);

	} else if (form === 'staff') {
		idStaffRecordToEdit = id;

		document.getElementById('staff_name').value = currentRecord.getAttribute(`data-${form}-record-name`);
		document.getElementById('staff_office_name').value = currentRecord.getAttribute(`data-${form}-record-office-name`);
	}

	document.querySelector(`.create_record[data-form="${form}"]`).disabled = true;
	document.querySelector(`.save_record[data-form="${form}"]`).disabled = false;
	document.querySelector(`.delete_few_records[data-form="${form}"]`).disabled = true;

	currentRecord.querySelector('.edit_record').disabled = true;
	currentRecord.querySelector('.delete_record').disabled = true;
}

function saveRecord(event) {
	event.preventDefault();
	const form = event.target.getAttribute('data-form');

	if(((form === 'offices') && (idOfficeRecordToEdit === null)) || 
		((form === 'staff') && (idStaffRecordToEdit === null))) 
			return 0;

	let values = formRecordValidation(form);
	if(!values) return 0;

	const {name, staffOfficeName} = values;

	if(form === 'offices') {
		if(officeArray.some(office => office.name === name)) {
			alert('Entered office already exist !');
			return 0;
		}

		const currentRecord = document.querySelector(`.${form}-record[data-${form}-record-id="${idOfficeRecordToEdit}"]`);

		currentRecord.setAttribute(`data-${form}-record-name`, name);
		currentRecord.querySelector('td:nth-child(1)').innerHTML = name;

		idOfficeRecordToEdit = null;

		currentRecord.querySelector('.edit_record').disabled = false;
		currentRecord.querySelector('.delete_record').disabled = false;

		document.getElementById('office_name').value = '';

	} else if (form === 'staff') {
		if(!officeArray.some(office => office.name === staffOfficeName)) {
			alert('Entered office does\'t exist !');
			return 0;
		}

		const currentRecord = document.querySelector(`.${form}-record[data-${form}-record-id="${idStaffRecordToEdit}"]`);
		
		currentRecord.setAttribute(`data-${form}-record-name`, name);
		currentRecord.setAttribute(`data-${form}-record-office-name`, staffOfficeName);
		
		currentRecord.querySelector('td:nth-child(1)').innerHTML = name;
		currentRecord.querySelector('td:nth-child(2)').innerHTML = staffOfficeName;

		idStaffRecordToEdit = null;

		currentRecord.querySelector('.edit_record').disabled = false;
		currentRecord.querySelector('.delete_record').disabled = false;

		document.getElementById('staff_name').value = '';
		document.getElementById('staff_office_name').value = '';
	}

	document.querySelector(`.create_record[data-form="${form}"]`).disabled = false;
	document.querySelector(`.save_record[data-form="${form}"]`).disabled = true;
	document.querySelector(`.delete_few_records[data-form="${form}"]`).disabled = false;
} 

function deleteRecord(id, form, fewRecords) {
	if(!fewRecords) {
		const check = window.confirm('Do you really want to delete this record ?');
		if(!check) return 0;
	}

	const currentRecord = document.querySelector(`.${form}-record[data-${form}-record-id="${id}"]`);
	
	if(form === 'offices') {
		const name = currentRecord.getAttribute(`data-${form}-record-name`);
		staffArray.filter(staff => staff.staffOfficeName === name)
			.forEach(staff => deleteRecord(staff.id, "staff", true));
	} 

	currentRecord.remove();
}

function deleteFewRecords(event) {
	event.preventDefault();

	const check = window.confirm('Do you really want to delete these records ?');
	if(!check) return 0;

	const form = event.target.getAttribute('data-form');

	const recordsToDelete =  document.querySelectorAll(`.${form}-record[data-${form}-record-checked="true"`);
	recordsToDelete.forEach(e => deleteRecord(e.getAttribute(`data-${form}-record-id`), form, true));
}

function delegationEditDelete(event) {
	if(event.target.className.split(' ').includes('edit_record')) {
		const form = event.target.getAttribute('data-form');
		const id = event.target.parentNode.parentNode.getAttribute(`data-${form}-record-id`);
		editRecord(id, form);
	} else if(event.target.className.split(' ').includes('delete_record')) {
		const form = event.target.getAttribute('data-form');
		const id = event.target.parentNode.parentNode.getAttribute(`data-${form}-record-id`);
		deleteRecord(id, form);
	} else {
		const form = event.target.parentNode.parentNode.getAttribute('data-form');
		const id = event.target.parentNode.getAttribute(`data-${form}-record-id`);
		const currentValueChecked = document.querySelector(`.${form}-record[data-${form}-record-id="${id}"]`).getAttribute(`data-${form}-record-checked`) === 'true';
		document.querySelector(`.${form}-record[data-${form}-record-id="${id}"]`).setAttribute(`data-${form}-record-checked`, !currentValueChecked);
	}
}

async function getOffices() {
	const url = 'http://dev.smartpelican.com/public/test_task/departments.php';
	const response = await fetch(url);
	const offices = await response.json();

	offices.forEach(office => createRecordHTML('offices', office.id, office.name));
}