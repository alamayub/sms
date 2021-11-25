<template>
  <v-app>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    overlay() {
      return this.$store.state.overlay
    }
  }
};
</script>

<style>
::-webkit-scrollbar { width: 0; }
.v-btn span {
  font-weight: 400 !important;
  font-size: 13px !important;
  text-transform: capitalize !important;
}
img {
  display: block;
  height: 100%;
  width: 100%;
  object-fit: cover;
}

/* Input Fields */
.v-text-field input, .v-input .v-label , textarea{
  font-size: 13px !important;
  color: rgb(0 0 0 / 80%) !important;
  font-weight: 400 !important;
  letter-spacing: 1px !important;
}
.v-input input { font-size: 13px !important; text-transform: capitalize !important; }
.v-input .v-label { 
  line-height: 1 !important;
  font-size: small !important;
}
.v-text-field--outlined.v-input--is-focused fieldset { border: 1px solid #502989 !important; }
.v-text-field--outlined.v-input--has-state fieldset { border: 1px solid #ff2059 !important; }
.v-input .v-icon.v-icon { font-size: 18px !important; }
.v-text-field--outlined.v-input--dense .v-label { top: 14px !important; }
.v-input__prepend-outer { display: none !important; }

/* DataTables */
.v-data-table > .v-data-table__wrapper > table > thead > tr > th:first-child, table > thead > tr > th:first-child { width: 40px !important; }
.v-data-table > .v-data-table__wrapper > table > thead > tr > th:last-child, table > thead > tr > th:last-child { width: 80px !important; }
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, table > tbody > tr > td,
.v-data-table > .v-data-table__wrapper > table > thead > tr > th, table > thead > tr > th,
.v-data-table > .v-data-table__wrapper > table > tfoot > tr > td, table > tfoot > tr > td { 
  padding: 0 10px !important; 
  height: 36px !important;
  font-weight: normal !important; 
  font-size: 13px !important;
}
.date { width: 175px !important; }

p {
  font-size: 13px;
  margin-bottom: 0 !important;
  text-align: justify;
  line-height: 1.4;
}

.text__overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Employee */
.employee {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15%, 1fr));
  grid-gap: 12px;  
}
/* projects */
.projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(23%, 1fr));
  grid-gap: 12px;
}
/* Attendance */
.attendance {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(22%, 1fr));
  grid-gap: 12px;
}
.card__item {
  border-radius: 6px;
  overflow: hidden; 
  position: relative; 
  cursor: pointer;
  transition: ease-in-out 250ms;
  border: .5px solid #4f29893b;
}
.card__item:hover {
  box-shadow: 0 2px 10px 0 #4f298941;
  border: .5px solid transparent;
}
@media (max-width: 1100px) {
  .employee { grid-template-columns: repeat(auto-fill, minmax(18%, 1fr)); }  
}
@media (max-width: 960px) {
  .employee { grid-template-columns: repeat(auto-fill, minmax(23%, 1fr)); }  
  .projects { grid-template-columns: repeat(auto-fill, minmax(30%, 1fr)); }
  .attendance { grid-template-columns: repeat(auto-fit, minmax(30%, 1fr)); }
}
@media (max-width: 760px) {
  .employee { grid-template-columns: repeat(auto-fill, minmax(30%, 1fr)); } 
  .projects { grid-template-columns: repeat(auto-fill, minmax(48%, 1fr)); } 
  .attendance { grid-template-columns: repeat(auto-fit, minmax(48%, 1fr)); }
}
@media (max-width: 560px) {
  .employee { grid-template-columns: repeat(auto-fill, minmax(48%, 1fr)); }  
}
@media (max-width: 500px) {
  .projects { grid-template-columns: repeat(auto-fill, minmax(100%, 1fr)); } 
  .attendance { grid-template-columns: repeat(auto-fit, minmax(100%, 1fr)); }
}
</style>
