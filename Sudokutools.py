import tkinter as tk
from random import randint, shuffle
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

def print_board(board):
    """
    Prints the sudoku board.

    Args:
        board (list[list[int]]): A 9x9 sudoku board represented as a list of lists of integers.

    Returns:
        None.
    """

    boardString = ""
    for i in range(9):
        for j in range(9):
            boardString += str(board[i][j]) + " "
            if (j + 1) % 3 == 0 and j != 0 and j + 1 != 9:
                boardString += "| "

            if j == 8:
                boardString += "\n"

            if j == 8 and (i + 1) % 3 == 0 and i + 1 != 9:
                boardString += "- - - - - - - - - - - \n"
    print(boardString)


def find_empty(board):
    """
    Finds an empty cell in the sudoku board.

    Args:
        board (list[list[int]]): A 9x9 sudoku board represented as a list of lists of integers.

    Returns:
        tuple[int, int]|None: The position of the first empty cell found as a tuple of row and column indices, or None if no empty cell is found.
    """

    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                return (i, j)
    return None


def valid(board, pos, num):
    """
    Checks whether a number is valid in a cell of the sudoku board.

    Args:
        board (list[list[int]]): A 9x9 sudoku board represented as a list of lists of integers.
        pos (tuple[int, int]): The position of the cell to check as a tuple of row and column indices.
        num (int): The number to check.

    Returns:
        bool: True if the number is valid in the cell, False otherwise.
    """

    for i in range(9):
        if board[i][pos[1]] == num:
            return False

    for j in range(9):
        if board[pos[0]][j] == num:
            return False

    start_i = pos[0] - pos[0] % 3
    start_j = pos[1] - pos[1] % 3
    for i in range(3):
        for j in range(3):
            if board[start_i + i][start_j + j] == num:
                return False
    return True


def solve(board):
    """
    Solves the sudoku board using the backtracking algorithm.

    Args:
        board (list[list[int]]): A 9x9 sudoku board represented as a list of lists of integers.

    Returns:
        bool: True if the sudoku board is solvable, False otherwise.
    """

    empty = find_empty(board)
    if not empty:
        return True

    for nums in range(1, 10):
        if valid(board, empty, nums):
            board[empty[0]][empty[1]] = nums

            if solve(board):  # recursive step
                return True
            board[empty[0]][empty[1]] = 0  # this number is wrong so we set it back to 0
    return False


def generate_board():
    """
    Generates a random sudoku board with fewer initial numbers.

    Returns:
        list[list[int]]: A 9x9 sudoku board represented as a list of lists of integers.
    """

    board
