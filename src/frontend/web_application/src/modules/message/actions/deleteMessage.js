import { deleteMessage as deleteMessageBase, removeFromCollection } from '../../../store/modules/message';

export const deleteMessage = ({ message }) => async (dispatch) => {
  const result = await dispatch(deleteMessageBase({ message }));

  await dispatch(removeFromCollection({ message }));

  return result;
};
