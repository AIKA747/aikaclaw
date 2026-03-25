package ai.aikaclaw.app.ui

import androidx.compose.runtime.Composable
import ai.aikaclaw.app.MainViewModel
import ai.aikaclaw.app.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
