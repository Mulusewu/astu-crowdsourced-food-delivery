export interface CampusBlock {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

// These are placeholder coordinates roughly centered around ASTU campus.
// The actual coordinates can be refined later.
export const CAMPUS_BLOCKS: CampusBlock[] = [
  { id: "freshman_dorm", name: "Freshman Dorms", lat: 8.5412, lng: 39.2715 },
  { id: "block_45", name: "Block 45", lat: 8.5450, lng: 39.2751 },
  { id: "library", name: "Main Library", lat: 8.5430, lng: 39.2730 },
  { id: "student_cafe", name: "Student Cafe", lat: 8.5440, lng: 39.2740 },
  { id: "admin_building", name: "Admin Building", lat: 8.5420, lng: 39.2720 },
  { id: "dorm_1", name: "Dormitory 1", lat: 8.5405, lng: 39.2705 },
  { id: "dorm_2", name: "Dormitory 2", lat: 8.5408, lng: 39.2708 },
  { id: "engineering_block", name: "Engineering Block", lat: 8.5460, lng: 39.2760 },
  { id: "applied_science", name: "Applied Science Block", lat: 8.5470, lng: 39.2770 },
  { id: "clinic", name: "Student Clinic", lat: 8.5415, lng: 39.2735 },
];
