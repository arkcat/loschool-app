import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import userAtom from "@/recoil/userAtom";
import { useRecoilState } from "recoil";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";

const FILE_UPLOAD_PATH =
  "https://wqoerpthqyjhpdccewhz.supabase.co/storage/v1/object/public/photo/uploads/";

interface FormDialogProps {
  setSnsList: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function FormDialog({ setSnsList }: FormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [userState, setUserState] = useRecoilState<any | null>(userAtom);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [imagePath, setImagePath] = React.useState<string | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);

      const file = event.target.files[0];

      if (file) {
        const uuid = uuidv4();
        const filePath = `uploads/${file.name}${uuid}`;
        setImagePath(FILE_UPLOAD_PATH + file.name + uuid);
        const { error: uploadError } = await supabase.storage
          .from("photo")
          .upload(filePath, file);

        if (uploadError) {
          console.error(uploadError);
          throw new Error("파일 업로드 에러");
        }
      }
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    console.log(formJson);
    const { error: insertError } = await supabase.from("Sns").insert(formJson);

    if (insertError) {
      console.error(insertError);
      throw new Error("글쓰기 에러");
    }
    const { data, error } = await supabase
      .from("Sns")
      .select()
      .filter("use_yn", "eq", "Y");
    if (error) {
      console.error(error);
      throw new Error("SNS 조회 에러");
    }
    setSnsList(data);
    handleClose();
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        endIcon={<AddCircleIcon />}
      >
        글쓰기
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSave,
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>작성하기</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="content"
            name="content"
            label="내용"
            type="text"
            fullWidth
            multiline
            rows={4}
          />
          <input type="hidden" name="member_id" value={userState?.id || ""} />
          <input
            type="hidden"
            name="nick_name"
            value={userState?.nick_name || ""}
          />
          <input
            required
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input type="hidden" name="image_path" value={imagePath || ""} />
          <input type="hidden" name="use_yn" value="Y" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit">글쓰기</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
