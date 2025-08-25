import { Component, OnInit } from '@angular/core';

interface BloodPressureEntry {
  systolic: number;
  diastolic: number;
  pulse: number;
  timestamp: string;
}

@Component({
  selector: 'app-blood-pressure',
  standalone: false,
  templateUrl: './blood-pressure.html',
  styleUrl: './blood-pressure.css'
})

export class BloodPressureComponent implements OnInit {
  entry: BloodPressureEntry = {
    systolic: 120,
    diastolic: 80,
    pulse: 70,
    timestamp: this.formatTime()
  };

  entries: BloodPressureEntry[] = [];
  editMode = false;
  editIndex: number | null = null;

  ngOnInit(): void {
    const saved = localStorage.getItem('bloodPressureEntries');
    if (saved) {
      this.entries = JSON.parse(saved);
    }
  }

  editEntry(index: number): void {
    this.editMode = true;
    this.editIndex = index;
    this.entry = { ...this.entries[index] };
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editIndex = null;
    this.resetEntry();
  }

  deleteEntry(index: number): void {
    this.entries.splice(index, 1);
    localStorage.setItem('bloodPressureEntries', JSON.stringify(this.entries));
  }

  resetEntry(): void {
    this.entry = {
      systolic: 120,
      diastolic: 80,
      pulse: 70,
      timestamp: this.formatTime()
    };
  }

  onSubmit(): void {
    this.entry.timestamp = this.formatTime();

    if (this.editMode && this.editIndex !== null) {
      this.entries[this.editIndex] = { ...this.entry };
      this.editMode = false;
      this.editIndex = null;
    } else {
      this.entries.unshift({ ...this.entry });
    }

    localStorage.setItem('bloodPressureEntries', JSON.stringify(this.entries));
    this.resetEntry();
  }

  formatTime(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    let formattedTimestamp = `${day}.${month}.${year} ${hours}.${minutes}`;
    return formattedTimestamp;
  }

  get avgSystolic(): number {
    return this.entries.length ? Math.round(this.entries.reduce((sum, e) => sum + e.systolic, 0) / this.entries.length) : 0;
  }

  get avgDiastolic(): number {
    return this.entries.length ? Math.round(this.entries.reduce((sum, e) => sum + e.diastolic, 0) / this.entries.length) : 0;
  }

  get avgPulse(): number {
    return this.entries.length ? Math.round(this.entries.reduce((sum, e) => sum + e.pulse, 0) / this.entries.length) : 0;
  }
}
