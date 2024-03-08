import tkinter as tk
from sudokutools import valid, solve, find_empty, generate_board
from copy import deepcopy

class SudokuSolverGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Sudoku Solver")
        self.board = generate_board()
        self.solved_board = deepcopy(self.board)
        solve(self.solved_board)
        self.create_widgets()

    def create_widgets(self):
        self.entries = [
            [tk.StringVar(value=str(self.board[i][j])) for j in range(9)] for i in range(9)
        ]

        for i in range(9):
            for j in range(9):
                entry = tk.Entry(
                    self.root, width=2, font=('Arial', 16), textvariable=self.entries[i][j]
                )
                entry.grid(row=i, column=j)
                entry.bind('<FocusIn>', self.clear_entry)

        solve_button = tk.Button(self.root, text="Solve", command=self.solve_puzzle)
        solve_button.grid(row=9, column=4, pady=10)

    def clear_entry(self, event):
        event.widget.delete(0, 'end')

    def solve_puzzle(self):
        for i in range(9):
            for j in range(9):
                try:
                    self.board[i][j] = int(self.entries[i][j].get())
                except ValueError:
                    tk.messagebox.showerror("Invalid Input", "Please enter valid numbers.")
                    return

        if solve(self.board):
            self.update_entries()
            tk.messagebox.showinfo("Sudoku Solver", "Puzzle solved successfully!")
        else:
            tk.messagebox.showerror("Sudoku Solver", "No solution exists.")

    def update_entries(self):
        for i in range(9):
            for j in range(9):
                self.entries[i][j].set(str(self.board[i][j]))

def main():
    root = tk.Tk()
    app = SudokuSolverGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()
