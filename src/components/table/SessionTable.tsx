import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Card,
  CardContent,
  Button,
  TextFieldProps,
  InputAdornment,
  TableContainer,
  TablePagination,
  Avatar,
  Chip,
} from "@mui/material";

import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconSearch,
  IconEye,
  IconDownload,
} from "@tabler/icons-react";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { styled } from "@mui/material/styles";
import SessionModel from "@/model/session";

const RoundTextField = styled((props: TextFieldProps) => (
  <CustomTextField {...props} />
))(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    height: "40px",
  },
  "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "0.8",
  },
  "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
    color: theme.palette.text.secondary,
    opacity: "1",
  },
  "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.grey[200],
  },
}));

type SessionTableProps = {
  paginationData?: {
    sessions: SessionModel[];
    total: number;
    page: number;
    limit: number;
  };
  onAddClicked?: () => void;
  onEditClicked?: (session: SessionModel) => void;
  onDeleteClicked?: (id: string) => void;
  onSearching?: (query: string) => void;
  onRowsPerPageChange?: (limit: number) => void;
  onPageChanged?: (page: number) => void;
  onViewDetailClicked?: (id: string) => void;
  onDownloadExcelClicked?: (id: string) => void;
};

const SessionTable = ({
  paginationData,
  onAddClicked,
  onEditClicked,
  onDeleteClicked,
  onSearching,
  onRowsPerPageChange,
  onPageChanged,
  onViewDetailClicked,
  onDownloadExcelClicked,
}: SessionTableProps) => {
  const sessions = paginationData?.sessions || [];
  const totalSessions = paginationData?.total || 0;
  const page = (paginationData?.page || 1) - 1;
  const limit = paginationData?.limit || 10;

  return (
    <Card sx={{ height: "100%", maxHeight: "500px", maxWidth: "900px" }}>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center items-start">
          <div className="flex mb-4 md:mb-0 flex-grow mr-2 justify-between w-full">
            <div className="flex-grow">
              <Typography variant="subtitle1" fontSize={18} fontWeight={600}>
                Daftar Sesi
              </Typography>
            </div>
            <div>
              <div>
                <Button variant="contained" size="small" onClick={onAddClicked}>
                  <IconPlus size={18} /> Tambah
                </Button>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 w-full">
            <RoundTextField
              placeholder="Cari sesi"
              className="flex-grow max-w-96"
              onChange={(e) => {
                if (onSearching) {
                  onSearching(e.target.value);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={18} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <Box>
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table
              stickyHeader
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
                mt: 2,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Nama
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Lihat
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Download
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Aksi
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell
                      sx={{ maxWidth: "200px", overflow: "hidden" }}
                      align="left"
                    >
                      <Typography
                        sx={{
                          lineClamp: 1,
                          WebkitLineClamp: 1,
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        color="textSecondary"
                        variant="subtitle2"
                      >
                        {session.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        justifyContent={"center"}
                        spacing={1}
                      >
                        <IconButton
                          aria-label="view"
                          onClick={() => {
                            if (onViewDetailClicked) {
                              onViewDetailClicked(session.id);
                            }
                          }}
                        >
                          {" "}
                          <IconEye size={20} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        justifyContent={"center"}
                        spacing={1}
                      >
                        <IconButton
                          aria-label="donwload"
                          onClick={() => {
                            if (onDownloadExcelClicked) {
                              onDownloadExcelClicked(session.id);
                            }
                          }}
                        >
                          <IconDownload size={20} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        justifyContent={"center"}
                        spacing={1}
                      >
                        <IconButton
                          aria-label="edit"
                          onClick={() => {
                            if (onEditClicked) {
                              onEditClicked(session);
                            }
                          }}
                        >
                          <IconEdit size={20} />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {
                            if (onDeleteClicked) {
                              onDeleteClicked(session.id);
                            }
                          }}
                        >
                          <IconTrash size={20} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ marginTop: 2 }}
            component="div"
            count={totalSessions}
            page={page}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => {
              if (onRowsPerPageChange) {
                onRowsPerPageChange(parseInt(e.target.value));
              }
            }}
            onPageChange={(e, page) => {
              if (onPageChanged) {
                onPageChanged(page);
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SessionTable;
