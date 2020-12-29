import {queryStrings} from '../deps';

const createUserTable = `
  
`

const createDoctorTable = `
create table doctor
(
    id serial not null
        constraint doctor_pkey
            primary key,
    state char not null,
    "firstName" varchar(64) not null,
    "lastName" varchar(64) not null,
    avatar varchar(64),
    "createdAt" timestamp default CURRENT_TIMESTAMP,
    "updatedAt" timestamp,
    sex char,
);

create unique index users_email	on users (upper(email));
create index users_state_idx on users (state);
`

const createClinicTable = `
create table clinic
(
    id serial not null
        constraint clinic_pkey
            primary key,
    state char not null,
    name varchar(64),
    logo varchar(64),
    "createdAt" timestamp default CURRENT_TIMESTAMP,
    "updatedAt" timestamp,
);

create unique index users_email	on users (upper(email));
create index clinic_state_idx on users (state);
`

export const up = queryStrings([
  createUserTable,
  createDoctorTable
]);
